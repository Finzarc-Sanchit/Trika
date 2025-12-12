import express from 'express';
import * as retreatController from '../controllers/retreatController.js';

const router = express.Router();

// GET /api/retreats - Get all retreats (public)
router.get('/', retreatController.getRetreats);

// GET /api/retreats/:id - Get retreat by ID (public)
router.get('/:id', retreatController.getRetreatById);

// POST /api/retreats - Create retreat (protected - add auth middleware if needed)
router.post('/', retreatController.createRetreat);

// PUT /api/retreats/:id - Update retreat (protected - add auth middleware if needed)
router.put('/:id', retreatController.updateRetreat);

// DELETE /api/retreats/:id - Delete retreat (protected - add auth middleware if needed)
router.delete('/:id', retreatController.deleteRetreat);

export default router;

