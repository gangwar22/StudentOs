import express from 'express';
import { getUserData, syncUserData } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/data/me', authenticate, getUserData);
router.post('/sync', authenticate, syncUserData);

export default router;
