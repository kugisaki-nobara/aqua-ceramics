const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyAdminToken } = require('../middleware/auth');

// GET /api/content - Get all company content fields
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM company_content').all();
    const content = {};
    for (const r of rows) {
      try {
        content[r.key] = JSON.parse(r.value);
      } catch (e) {
        content[r.key] = r.value;
      }
    }
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch company content.' });
  }
});

// PUT /api/content - Admin update company content key-values
router.put('/', verifyAdminToken, (req, res) => {
  try {
    const updates = req.body; // e.g. { overview: "...", vision: "...", milestones: [...] }
    const stmt = db.prepare(`
      INSERT INTO company_content (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    for (const [key, value] of Object.entries(updates)) {
      const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      stmt.run(key, valStr);
    }

    res.json({ success: true, message: 'Company content updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update content.' });
  }
});

module.exports = router;
