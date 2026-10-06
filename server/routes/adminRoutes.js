import express from 'express';
import {
  getAdminOverview,
  getAdminRequests,
  getStudentDetails,
  reviewAdminRequest,
  submitAdminRequest,
  updateUserAccess
} from '../controllers/adminController.js';
import { authenticate, requireAccessLevel } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/requests', authenticate, submitAdminRequest);
router.get('/overview', authenticate, requireAccessLevel('admin', 'super_admin'), getAdminOverview);
router.get('/users/:userId/details', authenticate, requireAccessLevel('admin', 'super_admin'), getStudentDetails);
router.get('/requests', authenticate, requireAccessLevel('super_admin'), getAdminRequests);
router.patch('/requests/:userId', authenticate, requireAccessLevel('super_admin'), reviewAdminRequest);
router.patch('/users/:userId/access', authenticate, requireAccessLevel('super_admin'), updateUserAccess);

export default router;

