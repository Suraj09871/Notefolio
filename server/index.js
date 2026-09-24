const path = require('path');
const fs = require('fs');
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');

const rootDir = path.join(__dirname, '..');

// Serve uploads if directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}

// Serve root static assets (CSS, JS, images, favicon)
app.use(express.static(rootDir, {
  extensions: ['html', 'htm']
}));

// Route handler for root
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Route handler for clean URLs (e.g. /cart, /my-notes, /admin-panel)
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const directHtml = path.join(rootDir, `${page}.html`);

  if (fs.existsSync(directHtml)) {
    return res.sendFile(directHtml);
  }
  next();
});

// 404 handler for API vs Frontend
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.status(404).sendFile(path.join(rootDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 NoteFolio Server running on port ${PORT}`);
  console.log(`🏠 Marketplace: http://localhost:${PORT}/`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin-panel.html`);
  console.log(`🔑 Admin login: http://localhost:${PORT}/login.html`);
});
