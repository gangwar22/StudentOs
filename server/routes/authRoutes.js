import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  sendVerificationCode,
  verifyEmail
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);
router.post('/email-verification/send', authenticate, sendVerificationCode);
router.post('/email-verification/verify', authenticate, verifyEmail);

export default router;
