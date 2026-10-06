import express from 'express';
import { handleAIMentorQuery, handleVoiceReflection, handleTextToSpeech } from '../controllers/aiController.js';
import { authenticateOptional } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/mentor', authenticateOptional, handleAIMentorQuery);
router.post('/voice/reflection', authenticateOptional, handleVoiceReflection);
router.all('/tts', handleTextToSpeech);

export default router;
