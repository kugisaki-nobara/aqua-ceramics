const express = require('express');
const router = express.Router();
const db = require('../database/db');

// POST /api/enquiries - Submit customer product, commercial project, or dealership enquiry
router.post('/', (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      company_name,
      city,
      enquiry_type,
      product_of_interest,
      subject,
      message
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Enquiry message cannot be empty.' });
    }

    const assignedSubject = subject && subject.trim() 
      ? subject.trim() 
      : (enquiry_type ? `${enquiry_type} - Aqua Ceramics` : 'General Sanitaryware Enquiry');

    const stmt = db.prepare(`
      INSERT INTO enquiries (
        name, phone, email, company_name, city,
        enquiry_type, product_of_interest, subject, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      phone.trim(),
      email ? email.trim() : '',
      company_name ? company_name.trim() : '',
      city ? city.trim() : '',
      enquiry_type ? enquiry_type.trim() : 'General',
      product_of_interest ? product_of_interest.trim() : 'Aqua Ceramics Sanitaryware',
      assignedSubject,
      message.trim(),
      'New'
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry. Aqua Ceramics LLP technical commercial team will contact you shortly.',
      enquiry_id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry. Please try again.' });
  }
});

// GET /api/enquiries - Fetch all inquiries (Public / Admin access)
router.get('/', (req, res) => {
  try {
    const statusFilter = req.query.status;
    let query = 'SELECT * FROM enquiries';
    const params = [];

    if (statusFilter && statusFilter !== 'All') {
      query += ' WHERE status = ?';
      params.push(statusFilter);
    }

    query += ' ORDER BY created_at DESC';

    const enquiries = db.prepare(query).all(...params);
    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

// PUT /api/enquiries/:id - Update status and admin notes
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const existing = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    const newStatus = status || existing.status;
    const newNotes = admin_notes !== undefined ? admin_notes : existing.admin_notes;

    db.prepare(`
      UPDATE enquiries 
      SET status = ?, admin_notes = ? 
      WHERE id = ?
    `).run(newStatus, newNotes, parseInt(id));

    res.json({
      success: true,
      message: `Enquiry #${id} updated successfully.`
    });
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to update enquiry.' });
  }
});

// DELETE /api/enquiries/:id - Remove or archive lead
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM enquiries WHERE id = ?').run(parseInt(id));
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: `Enquiry #${id} deleted.`
    });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete enquiry.' });
  }
});

module.exports = router;
