import express from 'express';
import { authenticate, requireAccessLevel } from '../middleware/authenticate.js';
import { 
  getCurriculumPhases, 
  getCurriculumPhaseById, 
  getCourses, 
  getCourseBySlug, 
  evaluateLearningContent, 
  addVideo,
  generateGeminiQuiz
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/curriculum', getCurriculumPhases);
router.get('/curriculum/:phaseId', getCurriculumPhaseById);
router.get('/courses', getCourses);
router.get('/courses/:slug', getCourseBySlug);
router.post('/learning-content/evaluate', evaluateLearningContent);
router.post('/videos/add', authenticate, requireAccessLevel('admin', 'super_admin'), addVideo);
router.post('/quiz/generate', authenticate, generateGeminiQuiz);

export default router;
