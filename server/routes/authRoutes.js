// Authentication routes
import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/login - Login user
router.post('/login', authController.login);

export default router;

