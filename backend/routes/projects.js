const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyAdminToken } = require('../middleware/auth');

// GET /api/projects - Public list of installation projects
router.get('/', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
});

// POST /api/projects - Admin add project
router.post('/', verifyAdminToken, (req, res) => {
  try {
    const { title, category, location, description, image_url, products_used } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO projects (title, category, location, description, image_url, products_used)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title.trim(),
      category.trim(),
      location ? location.trim() : 'Verified Project',
      description.trim(),
      image_url || '/images/hero_sanitaryware_banner.jpg',
      products_used ? products_used.trim() : ''
    );

    res.status(201).json({ success: true, message: 'Project added successfully.', id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add project.' });
  }
});

// DELETE /api/projects/:id - Admin delete project
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Project removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
});

module.exports = router;
