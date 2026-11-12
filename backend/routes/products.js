const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { verifyAdminToken } = require('../middleware/auth');

// GET /api/products - Fetch products with optional search, category, sort, and featured filter
router.get('/', (req, res) => {
  try {
    const { search, category, sort, featured, limit } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR code LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
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

// --- PROTECTED ADMIN ROUTES ON /api/products ---
// Enforce admin authentication on product write operations (Add / Edit / Delete)

// POST /api/products - Create new product (Admin only)
router.post('/', verifyAdminToken, (req, res) => {
  try {
    const {
      code, name, category, brand, price, promotional_price, stock, availability,
      description, dimensions, color_variants, material_finish,
      key_features, image_url, source_ref, is_featured
    } = req.body;

    if (!code || !name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product code, name, category, and price are required.' });
    }

    const existing = db.prepare('SELECT id FROM products WHERE code = ?').get(code.trim().toUpperCase());
    if (existing) {
      return res.status(400).json({ success: false, message: `Product code "${code}" already exists.` });
    }

    const featuresJson = Array.isArray(key_features)
      ? JSON.stringify(key_features)
      : (typeof key_features === 'string' ? key_features : JSON.stringify([]));

    const finalStock = stock !== undefined && stock !== '' ? parseInt(stock) : 0;
    const finalPrice = parseFloat(price);
    const defaultAvail = availability || (finalPrice === 0 ? 'Price not listed - Request Quote' : (finalStock > 0 ? 'In Stock' : 'Out of Stock'));

    const result = db.prepare(`
      INSERT INTO products (
        code, name, category, brand, price, promotional_price, stock, availability,
        description, dimensions, color_variants, material_finish,
        key_features, image_url, source_ref, is_featured, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      code.trim().toUpperCase(),
      name.trim(),
      category.trim(),
      brand ? brand.trim() : 'Aqua Ceramics',
      finalPrice,
      promotional_price !== undefined && promotional_price !== '' && promotional_price !== null ? parseFloat(promotional_price) : null,
      finalStock,
      defaultAvail,
      description ? description.trim() : '',
      dimensions ? dimensions.trim() : '',
      color_variants ? color_variants.trim() : '',
      material_finish ? material_finish.trim() : '',
      featuresJson,
      image_url !== undefined ? image_url.trim() : '',
      source_ref ? source_ref.trim() : '',
      is_featured ? 1 : 0
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product_id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to add product.', error: error.message });
  }
});

// PUT /api/products/:id - Update product details (Admin only)
router.put('/:id', verifyAdminToken, (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(id));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name, code, category, brand, price, promotional_price, stock, availability,
      description, dimensions, color_variants, material_finish,
      key_features, image_url, source_ref, is_featured
    } = req.body;

    // Check code collision if code changed
    if (code && code.trim().toUpperCase() !== product.code) {
      const codeCheck = db.prepare('SELECT id FROM products WHERE code = ? AND id != ?').get(code.trim().toUpperCase(), parseInt(id));
      if (codeCheck) {
        return res.status(400).json({ success: false, message: `Product code "${code}" is already in use by another product.` });
      }
    }

    const newCode = code ? code.trim().toUpperCase() : product.code;
    const newName = name ? name.trim() : product.name;
    const newCategory = category ? category.trim() : product.category;
    const newBrand = brand !== undefined ? brand.trim() : product.brand;
    const newPrice = price !== undefined && price !== '' ? parseFloat(price) : product.price;
    const newPromo = promotional_price !== undefined 
      ? (promotional_price !== '' && promotional_price !== null ? parseFloat(promotional_price) : null) 
      : product.promotional_price;
    const newStock = stock !== undefined && stock !== '' ? parseInt(stock) : product.stock;
    const newAvail = availability !== undefined ? availability : (newPrice === 0 ? 'Price not listed - Request Quote' : (newStock > 0 ? 'In Stock' : 'Out of Stock'));
    const newDesc = description !== undefined ? description.trim() : product.description;
    const newDims = dimensions !== undefined ? dimensions.trim() : product.dimensions;
    const newColors = color_variants !== undefined ? color_variants.trim() : product.color_variants;
    const newMaterial = material_finish !== undefined ? material_finish.trim() : product.material_finish;
    const newImage = image_url !== undefined ? image_url.trim() : product.image_url;
    const newSourceRef = source_ref !== undefined ? source_ref.trim() : product.source_ref;
    const newFeatured = is_featured !== undefined ? (is_featured ? 1 : 0) : product.is_featured;

    const featuresJson = key_features !== undefined
      ? (Array.isArray(key_features) ? JSON.stringify(key_features) : key_features)
      : product.key_features;

    db.prepare(`
      UPDATE products SET
        code = ?, name = ?, category = ?, brand = ?, price = ?, promotional_price = ?,
        stock = ?, availability = ?, description = ?, dimensions = ?, color_variants = ?,
        material_finish = ?, key_features = ?, image_url = ?, source_ref = ?,
        is_featured = ?
      WHERE id = ?
    `).run(
      newCode,
      newName,
      newCategory,
      newBrand,
      newPrice,
      newPromo,
      newStock,
      newAvail,
      newDesc,
      newDims,
      newColors,
      newMaterial,
      featuresJson,
      newImage,
      newSourceRef,
      newFeatured,
      parseInt(id)
    );

    res.json({
      success: true,
      message: `Product "${newName}" (ID #${id}) updated successfully.`
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product.', error: error.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT id, name, code FROM products WHERE id = ?').get(parseInt(id));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(parseInt(id));

    res.json({
      success: true,
      message: `Product "${product.name}" (${product.code}) was deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product.', error: error.message });
  }
});

module.exports = router;
