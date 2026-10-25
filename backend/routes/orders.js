const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/orders - Create new customer order with server-side validation
router.post('/', (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      address,
      city,
      state,
      postal_code,
      notes,
      payment_method,
      items
    } = req.body;

    // 1. Validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!customer_phone || !customer_phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!address || !address.trim() || !city || !state || !postal_code) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }
    const itemsList = Array.isArray(items) ? items : [items];
    if (!itemsList || itemsList.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items cannot be empty.' });
    }

    // 2. Server-side stock & price verification
    let grandTotal = 0;
    const validatedItems = [];

    for (const item of itemsList) {
      const pId = parseInt(item.productId || item.product_id || item.id);
      const qty = parseInt(item.quantity);

      if (isNaN(pId) || isNaN(qty) || qty <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid product quantity specified.' });
      }

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(pId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ID ${pId} not found in database.` });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Requested: ${qty}, Available: ${product.stock}.`
        });
      }

      // Use promotional price if available, else regular price
      const unitPrice = product.promotional_price || product.price;
      const itemSubtotal = unitPrice * qty;
      grandTotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_code: product.code,
        price: unitPrice,
        quantity: qty,
        subtotal: itemSubtotal
      });
    }

    // 3. Generate unique order reference number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `AQUA-ORD-${dateStr}-${randomSuffix}`;

    const payMethod = payment_method || 'bank_transfer';
    const payStatus = payMethod === 'razorpay' ? 'Paid' : 'Pending';

    // 4. Save order record
    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        order_ref, customer_name, customer_phone, customer_email,
        address, city, state, postal_code, notes,
        total_amount, payment_method, payment_status, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const orderResult = insertOrderStmt.run(
      orderRef,
      customer_name.trim(),
      customer_phone.trim(),
      customer_email ? customer_email.trim() : '',
      address.trim(),
      city.trim(),
      state.trim(),
      postal_code.trim(),
      notes ? notes.trim() : '',
      grandTotal,
      payMethod,
      payStatus,
      'Order Placed'
    );

    const orderId = orderResult.lastInsertRowid;

    // 5. Insert order items & decrement stock in SQLite
    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, product_code, price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStockStmt = db.prepare(`
      UPDATE products SET stock = stock - ? WHERE id = ?
    `);

    for (const vItem of validatedItems) {
      insertItemStmt.run(
        orderId,
        vItem.product_id,
        vItem.product_name,
        vItem.product_code,
        vItem.price,
        vItem.quantity,
        vItem.subtotal
      );
      updateStockStmt.run(vItem.quantity, vItem.product_id);
    }

    // 6. Record initial timeline history
    db.prepare(`
      INSERT INTO order_status_history (order_id, status, notes, updated_by)
      VALUES (?, ?, ?, ?)
    `).run(orderId, 'Order Placed', 'Order placed successfully by customer.', 'Customer');

    const createdOrder = {
      id: orderId,
      order_id: orderId,
      order_ref: orderRef,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email ? customer_email.trim() : '',
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postal_code.trim(),
      notes: notes ? notes.trim() : '',
      total_amount: grandTotal,
      payment_method: payMethod,
      payment_status: payStatus,
      order_status: 'Order Placed',
      created_at: new Date().toISOString(),
      items: validatedItems
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: createdOrder,
      data: createdOrder
    });

  } catch (error) {
    console.error('Order processing error:', error);
    res.status(500).json({ success: false, message: 'Failed to process order.' });
  }
});

// GET /api/orders/track/:orderRef - Track order status with complete timeline history
router.get('/track/:orderRef', (req, res) => {
  try {
    const { orderRef } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE LOWER(order_ref) = ?').get(orderRef.trim().toLowerCase());

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order reference not found.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC').all(order.id);

    // Standardized fulfillment stages
    const allStages = [
      'Order Placed',
      'Order Confirmed',
      'Processing',
      'Dispatched',
      'Out for Delivery',
      'Delivered'
    ];

    const trackedData = {
      ...order,
      items,
      history,
      stages: allStages
    };

    res.json({
      success: true,
      order: trackedData,
      data: trackedData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order tracking details.' });
  }
});

// GET /api/orders/my-orders - Customer order history
router.get('/my-orders', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const decoded = jwt.verify(token, JWT_SECRET);

    const orders = db.prepare('SELECT * FROM orders WHERE LOWER(customer_email) = ? ORDER BY created_at DESC').all(decoded.email.toLowerCase());

    const withItems = orders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
      return { ...ord, items };
    });

    res.json({ success: true, count: withItems.length, data: withItems });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
});

// Legacy backward-compatibility: GET /api/orders/:orderRef
router.get('/:orderRef', (req, res) => {
  try {
    const { orderRef } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE LOWER(order_ref) = ?').get(orderRef.trim().toLowerCase());

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC').all(order.id);

    res.json({ success: true, data: { ...order, items, history } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order.' });
  }
});

module.exports = router;
