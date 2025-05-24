import { Request, Response } from 'express';
import Pen from '../models/pen.model';
import EggProduction from '../models/eggProduction.model';

// Get all pens
export const getAllPens = async (req: Request, res: Response) => {
    const pens = await Pen.find();

    res.status(200).json({
        success: true,
        count: pens.length,
        data: pens,
    });
};

// Get pen by ID
export const getPenById = async (req: Request, res: Response) => {
    const pen = await Pen.findById(req.params.id);

    if (!pen) {
        return res.status(404).json({
            success: false,
            message: 'Pen not found',
        });
    }

    res.status(200).json({
        success: true,
        data: pen,
    });
};

// Create new pen
export const createPen = async (req: Request, res: Response) => {
    // Only farmers can create pens
    if (req.user.role !== 'farmer') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to create pens',
        });
    }

    const pen = await Pen.create(req.body);

    res.status(201).json({
        success: true,
        data: pen,
    });
};

// Update pen
export const updatePen = async (req: Request, res: Response) => {
    // Check if pen exists
    const pen = await Pen.findById(req.params.id);
    if (!pen) {
        return res.status(404).json({
            success: false,
            message: 'Pen not found',
        });
    }

    // Only farmers and workers can update pens
    if (req.user.role !== 'farmer' && req.user.role !== 'worker') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update pens',
        });
    }

    const updatedPen = await Pen.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: updatedPen,
    });
};

// Delete pen
export const deletePen = async (req: Request, res: Response) => {
    // Check if pen exists
    const pen = await Pen.findById(req.params.id);
    if (!pen) {
        return res.status(404).json({
            success: false,
            message: 'Pen not found',
        });
    }

    // Only farmers can delete pens
    if (req.user.role !== 'farmer') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete pens',
        });
    }

    await Pen.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Pen deleted successfully',
    });
};

// Get egg production for a specific pen
export const getPenEggProduction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Check if pen exists
    const pen = await Pen.findById(id);
    if (!pen) {
        return res.status(404).json({
            success: false,
            message: 'Pen not found',
        });
    }

    // Build query
    const query: any = { penNumber: pen.penNumber };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
    }

    const eggProduction = await EggProduction.find(query).sort({ date: -1 });

    res.status(200).json({
        success: true,
        count: eggProduction.length,
        data: eggProduction,
    });
};