require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Database initialization & seeding
const db = require('./database/db');
const seedDatabase = require('./database/seed');
seedDatabase();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors());

// Rate Limiting for API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api/', apiLimiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static images serving
const publicImagesPath = path.join(__dirname, '../public/images');
if (fs.existsSync(publicImagesPath)) {
  app.use('/images', express.static(publicImagesPath));
}

// REST API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/quotations', require('./routes/quotations'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/content', require('./routes/content'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    company: 'AQUA CERAMICS LLP',
    tagline: 'DESIGNED FOR COMFORT BUILT FOR LIFE',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend: Check if React Vite build 'dist/' exists, otherwise serve 'public/'
const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, '../public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, message: 'API endpoint not found.' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, message: 'API endpoint not found.' });
    }
    let pageFile = req.path === '/' ? 'index.html' : req.path;
    if (!pageFile.endsWith('.html')) pageFile += '.html';
    const targetFile = path.join(publicPath, pageFile);
    if (fs.existsSync(targetFile)) {
      res.sendFile(targetFile);
    } else {
      res.sendFile(path.join(publicPath, 'index.html'));
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` AQUA CERAMICS LLP — Enterprise Platform Online`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Tagline: DESIGNED FOR COMFORT BUILT FOR LIFE`);
  console.log(` Contact: 7019254016 | business@aquaceramics.in`);
  console.log(`==================================================`);
});

module.exports = app;
