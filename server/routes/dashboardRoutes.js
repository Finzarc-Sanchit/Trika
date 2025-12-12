import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/stats', authenticate, dashboardController.getDashboardStats);

export default router;

