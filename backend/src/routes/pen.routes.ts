import express from 'express';
import {
    getAllPens,
    getPenById,
    createPen,
    updatePen,
    deletePen,
    getPenEggProduction
} from '../controllers/pen.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// Get all pens
router.get('/', authenticate, asyncHandler(getAllPens));

// Get pen by ID
router.get('/:id', authenticate, asyncHandler(getPenById));

// Create new pen
router.post('/', authenticate, asyncHandler(createPen));

// Update pen
router.put('/:id', authenticate, asyncHandler(updatePen));

// Delete pen
router.delete('/:id', authenticate, asyncHandler(deletePen));

// Get egg production for a specific pen
router.get('/:id/egg-production', authenticate, asyncHandler(getPenEggProduction));

export default router;