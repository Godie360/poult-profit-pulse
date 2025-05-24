import express from 'express';
import {
    getAllRecords,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordsByDate,
    getRecordsByPen
} from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// Get all records
router.get('/', authenticate, asyncHandler(getAllRecords));

// Get records by date range
router.get('/date', authenticate, asyncHandler(getRecordsByDate));

// Get records by pen
router.get('/pen/:penId', authenticate, asyncHandler(getRecordsByPen));

// Get record by ID
router.get('/:id', authenticate, asyncHandler(getRecordById));

// Create new record
router.post('/', authenticate, asyncHandler(createRecord));

// Update record
router.put('/:id', authenticate, asyncHandler(updateRecord));

// Delete record
router.delete('/:id', authenticate, asyncHandler(deleteRecord));

export default router;