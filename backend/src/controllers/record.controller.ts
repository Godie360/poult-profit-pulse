import { Request, Response } from 'express';
import Record from '../models/record.model';
import Pen from '../models/pen.model';

// Get all records
export const getAllRecords = async (req: Request, res: Response) => {
    const records = await Record.find().sort({ date: -1 });

    res.status(200).json({
        success: true,
        count: records.length,
        data: records,
    });
};

// Get record by ID
export const getRecordById = async (req: Request, res: Response) => {
    const record = await Record.findById(req.params.id);

    if (!record) {
        return res.status(404).json({
            success: false,
            message: 'Record not found',
        });
    }

    res.status(200).json({
        success: true,
        data: record,
    });
};

// Get records by date range
export const getRecordsByDate = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    // Build query
    const query: any = {};

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
    }

    const records = await Record.find(query).sort({ date: -1 });

    res.status(200).json({
        success: true,
        count: records.length,
        data: records,
    });
};

// Get records by pen
export const getRecordsByPen = async (req: Request, res: Response) => {
    const { penId } = req.params;
    const { startDate, endDate } = req.query;

    // Check if pen exists
    const pen = await Pen.findById(penId);

    if (!pen) {
        return res.status(404).json({
            success: false,
            message: 'Pen not found',
        });
    }

    // Build query
    const query: any = { penId };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
    }

    const records = await Record.find(query).sort({ date: -1 });

    res.status(200).json({
        success: true,
        count: records.length,
        data: records,
    });
};

// Create new record
export const createRecord = async (req: Request, res: Response) => {
    // Only farmers and workers can create records
    if (req.user.role !== 'farmer' && req.user.role !== 'worker') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to create records',
        });
    }

    // Check if pen exists if penId is provided
    if (req.body.penId) {
        const pen = await Pen.findById(req.body.penId);

        if (!pen) {
            return res.status(404).json({
                success: false,
                message: 'Pen not found',
            });
        }
    }

    // Add user ID to record
    req.body.userId = req.user._id;

    const record = await Record.create(req.body);

    // Update pen's daily egg production if this is an egg production record
    if (req.body.recordType === 'eggProduction' && req.body.penId) {
        await Pen.findByIdAndUpdate(req.body.penId, {
            dailyEggProduction: req.body.quantity,
        });
    }

    res.status(201).json({
        success: true,
        data: record,
    });
};

// Update record
export const updateRecord = async (req: Request, res: Response) => {
    // Check if record exists
    const record = await Record.findById(req.params.id);

    if (!record) {
        return res.status(404).json({
            success: false,
            message: 'Record not found',
        });
    }

    // Only farmers, workers, and the user who created the record can update it
    if (
        req.user.role !== 'farmer' &&
        req.user.role !== 'worker' &&
        record.userId.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this record',
        });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    // Update pen's daily egg production if this is an egg production record
    if (updatedRecord?.recordType === 'eggProduction' && updatedRecord.penId) {
        await Pen.findByIdAndUpdate(updatedRecord.penId, {
            dailyEggProduction: updatedRecord.quantity,
        });
    }

    res.status(200).json({
        success: true,
        data: updatedRecord,
    });
};

// Delete record
export const deleteRecord = async (req: Request, res: Response) => {
    // Check if record exists
    const record = await Record.findById(req.params.id);

    if (!record) {
        return res.status(404).json({
            success: false,
            message: 'Record not found',
        });
    }

    // Only farmers and the user who created the record can delete it
    if (
        req.user.role !== 'farmer' &&
        record.userId.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this record',
        });
    }

    await Record.findByIdAndDelete(req.params.id);

    // Reset pen's daily egg production if this was an egg production record
    if (record.recordType === 'eggProduction' && record.penId) {
        await Pen.findByIdAndUpdate(record.penId, {
            dailyEggProduction: 0,
        });
    }

    res.status(200).json({
        success: true,
        message: 'Record deleted successfully',
    });
};