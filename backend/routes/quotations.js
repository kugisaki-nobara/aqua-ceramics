const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyAdminToken } = require('../middleware/auth');

// POST /api/quotations - Submit a customer quotation request
router.post('/', (req, res) => {
  try {
    const {
      product_id,
      product_name,
      quantity,
      customer_name,
      customer_phone,
      customer_email,
      message
    } = req.body;

    if (!customer_name || !customer_phone || !message) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, and inquiry message are required.' });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quoteRef = `AQUA-QT-${dateStr}-${randomSuffix}`;

    const stmt = db.prepare(`
      INSERT INTO quotations (
        quote_ref, product_id, product_name, quantity,
        customer_name, customer_phone, customer_email,
        message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      quoteRef,
      product_id ? parseInt(product_id) : null,
      product_name ? product_name.trim() : 'Custom Sanitaryware Specification',
      quantity ? parseInt(quantity) : 1,
      customer_name.trim(),
      customer_phone.trim(),
      customer_email ? customer_email.trim() : '',
      message.trim(),
      'New'
    );

    const quoteObj = {
      id: result.lastInsertRowid,
      quote_id: result.lastInsertRowid,
      quote_ref: quoteRef,
      product_name: product_name ? product_name.trim() : 'Custom Sanitaryware Specification',
      quantity: quantity ? parseInt(quantity) : 1,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email ? customer_email.trim() : '',
      message: message.trim(),
      status: 'New',
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Your quote request has been submitted. Our commercial desk will review and contact you with special pricing.',
      quotation: quoteObj,
      data: quoteObj
    });
  } catch (error) {
    console.error('Quotation error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quotation request.' });
  }
});

// GET /api/quotations - Admin list of quotations
router.get('/', verifyAdminToken, (req, res) => {
  try {
    const quotes = db.prepare('SELECT * FROM quotations ORDER BY created_at DESC').all();
    res.json({ success: true, count: quotes.length, quotations: quotes, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quotations.' });
  }
});

// PUT /api/quotations/:id/status - Admin update quotation
router.put('/:id/status', verifyAdminToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status, proposed_price, admin_notes } = req.body;

    const existing = db.prepare('SELECT * FROM quotations WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }

    db.prepare(`
      UPDATE quotations
      SET status = ?, proposed_price = ?, admin_notes = ?
      WHERE id = ?
    `).run(
      status || existing.status,
      proposed_price !== undefined ? parseFloat(proposed_price) : existing.proposed_price,
      admin_notes !== undefined ? admin_notes.trim() : existing.admin_notes,
      id
    );

    res.json({ success: true, message: `Quotation #${existing.quote_ref} updated successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update quotation.' });
  }
});

module.exports = router;
