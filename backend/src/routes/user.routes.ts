import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
    updatePassword
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// Get current user
router.get('/me', authenticate, asyncHandler(getCurrentUser));

// Update password
router.put('/password', authenticate, asyncHandler(updatePassword));

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), asyncHandler(getAllUsers));

// Get user by ID (admin only)
router.get('/:id', authenticate, authorize(['admin']), asyncHandler(getUserById));

// Update user (admin only)
router.put('/:id', authenticate, authorize(['admin']), asyncHandler(updateUser));

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(['admin']), asyncHandler(deleteUser));

export default router;