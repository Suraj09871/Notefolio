const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection caching for serverless (prevents multiple connections)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notefolio';

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
  }
}

// Ensure DB is connected before any route handler runs (critical for serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes — all under /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Admin authentication endpoint with Email & Admin Secret Key
app.post('/api/admin/login', async (req, res) => {
  const { email, username, adminKey, password } = req.body;

  const inputEmail = (email || username || '').trim().toLowerCase();
  const inputKey = (adminKey || password || '').trim();

  const validAdminEmails = [
    (process.env.ADMIN_EMAIL || 'admin@notefolio.com').toLowerCase(),
    'admin@notefolio.com',
    'admin'
  ];

  const validAdminKeys = [
    process.env.ADMIN_KEY || 'admin_key_2026',
    process.env.ADMIN_PASSWORD || 'admin123',
    'admin_key_2026',
    'admin123'
  ];

  if (validAdminEmails.includes(inputEmail) && validAdminKeys.includes(inputKey)) {
    const token = jwt.sign(
      { id: 'admin', role: 'admin', email: inputEmail },
      process.env.JWT_SECRET || 'notefolio_jwt_secret_key_2026_secure',
      { expiresIn: '24h' }
    );
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token: token,
      admin: {
        email: inputEmail === 'admin' ? 'admin@notefolio.com' : inputEmail,
        role: 'admin'
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin email or admin key'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NoteFolio API is running',
    dbConnected: isConnected,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = app;
