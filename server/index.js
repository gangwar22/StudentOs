import express from 'express';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Production Static Frontend Assets
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Database Connection
const startServer = async () => {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured before starting the production server.');
  }
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`🚀 Full-Stack MERN Backend Server running on port ${PORT}`);
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'Learning_Data',
    connected: mongoose.connection.readyState === 1
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', aiRoutes); // For /api/voice/reflection
app.use('/api', courseRoutes);

// SPA Client Route Fallback for non-API routes in production
if (fs.existsSync(distPath)) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

startServer().catch(async (error) => {
  console.error(`Server startup failed: ${error.message}`);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    console.error(`MongoDB cleanup after startup failure failed: ${disconnectError.message}`);
  }
  process.exitCode = 1;
});
