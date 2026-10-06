import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDefaultOtps } from './models/OtpRecord.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & seed default OTP records
connectDB().then(() => {
  seedDefaultOtps();
});

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend API is running smoothly' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('MERN Auth API Server is running.');
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
