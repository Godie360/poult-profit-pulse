import { Request, Response } from 'express';
import User from '../models/user.model';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    res.status(200).json({
        success: true,
        data: user,
    });
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({
        success: true,
        data: user,
    });
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
    // Check if user exists
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, password: undefined }, // Prevent password update through this route
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
        success: true,
        data: updatedUser,
    });
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
    // Check if user exists
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
};

// Update password
export const updatePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Current password is incorrect',
        });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    });
};