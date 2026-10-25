const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/products - Fetch products with optional search, category, sort, and featured filter
router.get('/', (req, res) => {
  try {
    const { search, category, sort, featured, limit } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR code LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category.trim());
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND is_featured = 1';
    }

    // Sorting
    if (sort === 'price_asc') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'name_asc') {
      sql += ' ORDER BY name ASC';
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    if (limit && !isNaN(parseInt(limit))) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    // Parse JSON key_features if available
    const products = rows.map(p => {
      let keyFeatures = [];
      try {
        if (p.key_features) keyFeatures = JSON.parse(p.key_features);
      } catch (e) {
        keyFeatures = [];
      }
      return {
        ...p,
        key_features: keyFeatures
      };
    });

    res.json({
      success: true,
      count: products.length,
      products: products,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
});

// GET /api/products/categories - List distinct category names
router.get('/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category ASC').all();
    const categories = rows.map(r => r.category);
    res.json({
      success: true,
      categories: categories,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
});

// GET /api/products/:idOrCode - Get single product details
router.get('/:idOrCode', (req, res) => {
  try {
    const { idOrCode } = req.params;
    let product;

    if (!isNaN(parseInt(idOrCode))) {
      product = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(idOrCode));
    } else {
      product = db.prepare('SELECT * FROM products WHERE code = ?').get(idOrCode.toUpperCase());
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let keyFeatures = [];
    try {
      if (product.key_features) keyFeatures = JSON.parse(product.key_features);
    } catch (e) {
      keyFeatures = [];
    }

    const productObj = {
      ...product,
      key_features: keyFeatures
    };

    res.json({
      success: true,
      product: productObj,
      data: productObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});

module.exports = router;
