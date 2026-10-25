const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET, verifyAdminToken } = require('../middleware/auth');

// POST /api/auth/register - Register new customer account
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name.trim(), email.trim().toLowerCase(), phone ? phone.trim() : '', passwordHash, 'customer');

    const token = jwt.sign(
      { id: result.lastInsertRowid, email: email.trim().toLowerCase(), name: name.trim(), role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: result.lastInsertRowid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

// POST /api/auth/login - Login customer or admin
router.post('/login', (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and password are required.' });
    }

    // Check users table first
    let user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(identifier);

    // If not found in users, check legacy admin_users table for admin login
    if (!user) {
      const adminUser = db.prepare('SELECT * FROM admin_users WHERE LOWER(username) = ? OR LOWER(email) = ?').get(identifier, identifier);
      if (adminUser) {
        user = {
          id: adminUser.id,
          name: adminUser.username,
          email: adminUser.email,
          password_hash: adminUser.password_hash,
          role: 'admin'
        };
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// GET /api/auth/profile - Get authenticated user profile
router.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      // Might be admin
      return res.json({
        success: true,
        user: {
          id: decoded.id,
          name: decoded.name || 'Admin',
          email: decoded.email,
          role: decoded.role
        }
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
});

module.exports = router;
