import express from 'express';
import {
  registerUser,
  loginUser,
  sendOtp,
  loginWithOtp,
} from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   POST /api/auth/send-otp
router.post('/send-otp', sendOtp);

// @route   POST /api/auth/login-otp
router.post('/login-otp', loginWithOtp);

export default router;
