const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET, verifyAdminToken } = require('../middleware/auth');

// POST /api/admin/login - Authenticate administrator
router.post('/login', (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    let user = db.prepare('SELECT * FROM users WHERE (LOWER(email) = ? OR LOWER(name) = ?) AND role = "admin"').get(identifier.toLowerCase(), identifier.toLowerCase());

    if (!user) {
      const legacyAdmin = db.prepare('SELECT * FROM admin_users WHERE LOWER(username) = ? OR LOWER(email) = ?').get(identifier.toLowerCase(), identifier.toLowerCase());
      if (legacyAdmin) {
        user = {
          id: legacyAdmin.id,
          name: legacyAdmin.username,
          email: legacyAdmin.email,
          password_hash: legacyAdmin.password_hash,
          role: 'admin'
        };
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
});

// All routes below require Admin JWT authentication token
router.use(verifyAdminToken);

// GET /api/admin/metrics - Real database metrics
router.get('/metrics', (req, res) => {
  try {
    const totalEnquiriesRow = db.prepare('SELECT COUNT(*) as count FROM enquiries').get();
    const newEnquiriesRow = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'New'").get();
    const contactedLeadsRow = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Contacted'").get();
    const inProgressLeadsRow = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status IN ('In Discussion', 'In Progress')").get();
    const convertedLeadsRow = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Converted'").get();

    const totalQuotesRow = db.prepare('SELECT COUNT(*) as count FROM quotations').get();
    const pendingQuotesRow = db.prepare("SELECT COUNT(*) as count FROM quotations WHERE status IN ('New', 'Pending', 'Under Review')").get();
    const totalProductsRow = db.prepare('SELECT COUNT(*) as count FROM products').get();

    const recentEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 10').all();
    const recentQuotations = db.prepare('SELECT * FROM quotations ORDER BY created_at DESC LIMIT 5').all();

    const metricsData = {
      totalLeads: totalEnquiriesRow.count,
      newLeads: newEnquiriesRow.count,
      contactedLeads: contactedLeadsRow.count,
      inProgressLeads: inProgressLeadsRow.count,
      convertedLeads: convertedLeadsRow.count,
      totalQuotations: totalQuotesRow.count,
      pendingQuotations: pendingQuotesRow ? pendingQuotesRow.count : 0,
      totalProducts: totalProductsRow.count,
      totalEnquiries: totalEnquiriesRow.count,
      pendingEnquiries: newEnquiriesRow.count
    };

    res.json({
      success: true,
      metrics: metricsData,
      data: metricsData,
      recentEnquiries,
      recentQuotations
    });
  } catch (error) {
    console.error('Metrics computation error:', error);
    res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics.' });
  }
});

// GET /api/admin/orders - Retrieve all orders with items & history
router.get('/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();

    const ordersWithItems = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC').all(order.id);
      return {
        ...order,
        items,
        history
      };
    });

    res.json({
      success: true,
      count: ordersWithItems.length,
      data: ordersWithItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
});

// PUT /api/admin/orders/:id/status - Update order status and record in timeline history
router.put('/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, status, payment_status, tracking_number, notes } = req.body;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const newOrderStatus = status || order_status || order.order_status || 'Order Placed';
    const newPaymentStatus = payment_status || order.payment_status || 'Pending';
    const newTracking = tracking_number ? tracking_number : (order.tracking_number || null);
    const noteText = notes ? notes.trim() : `Status updated to ${newOrderStatus} by Administrator.`;

    db.prepare(`
      UPDATE orders
      SET order_status = ?, payment_status = ?, tracking_number = ?
      WHERE id = ?
    `).run(newOrderStatus, newPaymentStatus, newTracking, parseInt(id));

    // Record timeline step if status changed or notes provided
    db.prepare(`
      INSERT INTO order_status_history (order_id, status, notes, updated_by)
      VALUES (?, ?, ?, 'Admin')
    `).run(parseInt(id), newOrderStatus, noteText);

    res.json({
      success: true,
      message: `Order #${order.order_ref} status updated to "${newOrderStatus}".`
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status.', error: error.message });
  }
});

// GET /api/admin/enquiries - Retrieve customer enquiries
router.get('/enquiries', (req, res) => {
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
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

// PUT /api/admin/enquiries/:id/status - Update lead status & notes
router.put('/enquiries/:id/status', (req, res) => {
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
      message: `Lead #${id} status updated to "${newStatus}".`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update lead status.' });
  }
});

// DELETE /api/admin/enquiries/:id - Delete inquiry
router.delete('/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM enquiries WHERE id = ?').run(parseInt(id));
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    res.json({ success: true, message: `Lead #${id} deleted.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete lead.' });
  }
});

// POST /api/admin/products - Add new product
router.post('/products', (req, res) => {
  try {
    const {
      code, name, category, brand, price, promotional_price, stock, availability,
      description, dimensions, color_variants, material_finish,
      key_features, image_url, is_featured
    } = req.body;

    if (!code || !name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Code, name, category, price, and stock are required.' });
    }

    const existing = db.prepare('SELECT id FROM products WHERE code = ?').get(code.trim().toUpperCase());
    if (existing) {
      return res.status(400).json({ success: false, message: `Product code "${code}" already exists.` });
    }

    const featuresJson = Array.isArray(key_features)
      ? JSON.stringify(key_features)
      : (typeof key_features === 'string' ? key_features : JSON.stringify([]));

    const result = db.prepare(`
      INSERT INTO products (
        code, name, category, brand, price, promotional_price, stock, availability,
        description, dimensions, color_variants, material_finish,
        key_features, image_url, is_featured, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      code.trim().toUpperCase(),
      name.trim(),
      category.trim(),
      brand ? brand.trim() : 'Aqua Ceramics',
      parseFloat(price),
      promotional_price ? parseFloat(promotional_price) : null,
      parseInt(stock),
      availability || (parseInt(stock) > 0 ? 'In Stock' : 'Out of Stock'),
      description ? description.trim() : '',
      dimensions ? dimensions.trim() : '',
      color_variants ? color_variants.trim() : '',
      material_finish ? material_finish.trim() : '',
      featuresJson,
      image_url || '/images/products/wall-hung-toilet.jpg',
      is_featured ? 1 : 0
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product_id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to add product.' });
  }
});

// PUT /api/admin/products/:id - Update product details
router.put('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name, category, price, promotional_price, stock, availability,
      description, dimensions, color_variants, material_finish,
      key_features, image_url, is_featured
    } = req.body;

    const newPrice = price !== undefined ? parseFloat(price) : product.price;
    const newPromo = promotional_price !== undefined ? (promotional_price ? parseFloat(promotional_price) : null) : product.promotional_price;
    const newStock = stock !== undefined ? parseInt(stock) : product.stock;
    const newAvail = availability || (newStock > 0 ? 'In Stock' : 'Out of Stock');

    const featuresJson = key_features
      ? (Array.isArray(key_features) ? JSON.stringify(key_features) : key_features)
      : product.key_features;

    db.prepare(`
      UPDATE products SET
        name = ?, category = ?, price = ?, promotional_price = ?, stock = ?, availability = ?,
        description = ?, dimensions = ?, color_variants = ?, material_finish = ?,
        key_features = ?, image_url = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name ? name.trim() : product.name,
      category ? category.trim() : product.category,
      newPrice,
      newPromo,
      newStock,
      newAvail,
      description !== undefined ? description.trim() : product.description,
      dimensions !== undefined ? dimensions.trim() : product.dimensions,
      color_variants !== undefined ? color_variants.trim() : product.color_variants,
      material_finish !== undefined ? material_finish.trim() : product.material_finish,
      featuresJson,
      image_url || product.image_url,
      is_featured !== undefined ? (is_featured ? 1 : 0) : product.is_featured,
      id
    );

    res.json({
      success: true,
      message: `Product ID #${id} updated successfully.`
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    res.json({
      success: true,
      message: `Product ID #${id} deleted successfully.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

module.exports = router;
