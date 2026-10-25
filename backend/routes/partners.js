const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyAdminToken } = require('../middleware/auth');

// GET /api/partners - Public list of partners
router.get('/', (req, res) => {
  try {
    const partners = db.prepare('SELECT * FROM partners WHERE status = "Published" ORDER BY created_at DESC').all();
    res.json({ success: true, count: partners.length, data: partners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch partners.' });
  }
});

// POST /api/partners - Admin add partner
router.post('/', verifyAdminToken, (req, res) => {
  try {
    const { name, category, website, description, logo_url } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO partners (name, category, website, description, logo_url, status)
      VALUES (?, ?, ?, ?, ?, 'Published')
    `);

    const result = stmt.run(
      name.trim(),
      category.trim(),
      website ? website.trim() : '',
      description ? description.trim() : '',
      logo_url || '/images/hero_sanitaryware_banner.jpg'
    );

    res.status(201).json({ success: true, message: 'Partner profile created.', id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add partner.' });
  }
});

// DELETE /api/partners/:id - Admin delete partner
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Partner profile removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete partner.' });
  }
});

module.exports = router;
