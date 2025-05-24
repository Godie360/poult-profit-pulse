import express from 'express';
import {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// Register a new user
router.post('/register', asyncHandler(register));

// Login user
router.post('/login', asyncHandler(login));

// Logout user
router.post('/logout', authenticate, asyncHandler(logout));

// Refresh token
router.post('/refresh-token', asyncHandler(refreshToken));

// Forgot password
router.post('/forgot-password', asyncHandler(forgotPassword));

// Reset password
router.post('/reset-password/:token', asyncHandler(resetPassword));

export default router;