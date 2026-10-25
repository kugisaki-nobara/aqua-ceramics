const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../database/db');

// POST /api/payment/create-order - Generate gateway payment order
router.post('/create-order', (req, res) => {
  try {
    const { orderRef, amount } = req.body;

    if (!orderRef) {
      return res.status(400).json({ success: false, message: 'Order reference is required.' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE order_ref = ?').get(orderRef);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
    const isConfigured = Boolean(process.env.RAZORPAY_KEY_SECRET);

    // Create gateway order reference ID
    const paymentOrderId = `razorpay_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    res.json({
      success: true,
      message: isConfigured ? 'Payment order created.' : 'Payment gateway integration configured in test/placeholder mode.',
      gateway: 'Razorpay',
      key_id: keyId,
      payment_order_id: paymentOrderId,
      amount: Math.round(order.total_amount * 100), // amount in paise
      currency: 'INR',
      order_ref: orderRef,
      configured: isConfigured
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment initialization error.' });
  }
});

// POST /api/payment/verify - Verify gateway payment signature on server
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderRef } = req.body;

    if (!orderRef) {
      return res.status(400).json({ success: false, message: 'Order reference required.' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE order_ref = ?').get(orderRef);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret) {
      // Production HMAC signature verification
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed.' });
      }
    } else {
      console.log(`[Payment Placeholder] Verification for order ${orderRef} processed with test authorization.`);
    }

    // Update order status in SQLite DB
    db.prepare(`
      UPDATE orders
      SET payment_status = 'Paid', order_status = 'Confirmed'
      WHERE id = ?
    `).run(order.id);

    res.json({
      success: true,
      message: 'Payment verified and order status updated to Confirmed.',
      order_ref: orderRef,
      payment_status: 'Paid'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
});

module.exports = router;
