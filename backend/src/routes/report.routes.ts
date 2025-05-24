import express from 'express';
import {
    getEggProductionReport,
    getFeedConsumptionReport,
    getMortalityReport,
    getFinancialReport,
    getPerformanceMetrics
} from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// Get egg production report
router.get('/egg-production', authenticate, asyncHandler(getEggProductionReport));

// Get feed consumption report
router.get('/feed-consumption', authenticate, asyncHandler(getFeedConsumptionReport));

// Get mortality report
router.get('/mortality', authenticate, asyncHandler(getMortalityReport));

// Get financial report
router.get('/financial', authenticate, asyncHandler(getFinancialReport));

// Get performance metrics
router.get('/performance', authenticate, asyncHandler(getPerformanceMetrics));

export default router;