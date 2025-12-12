import express from 'express';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

// GET /api/sessions - Get all sessions (public)
router.get('/', sessionController.getSessions);

// GET /api/sessions/:id - Get session by ID (public)
router.get('/:id', sessionController.getSessionById);

// POST /api/sessions - Create session (protected - add auth middleware if needed)
router.post('/', sessionController.createSession);

// PUT /api/sessions/:id - Update session (protected - add auth middleware if needed)
router.put('/:id', sessionController.updateSession);

// DELETE /api/sessions/:id - Delete session (protected - add auth middleware if needed)
router.delete('/:id', sessionController.deleteSession);

export default router;

