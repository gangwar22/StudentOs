import express from 'express';
import { generateAssessmentQuiz } from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/generate', authenticate, generateAssessmentQuiz);

export default router;
