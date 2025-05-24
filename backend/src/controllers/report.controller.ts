import { Request, Response } from 'express';
import Record from '../models/record.model';
import Pen from '../models/pen.model';
import EggProduction from '../models/eggProduction.model';

// Get egg production report
export const getEggProductionReport = async (req: Request, res: Response) => {
    const { startDate, endDate, penId } = req.query;

    // Build query
    const query: any = { recordType: 'eggProduction' };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
    }

    if (penId) {
        query.penId = penId;
    }

    // Get egg production records
    const eggRecords = await Record.find(query).sort({ date: 1 });

    // Group by date
    const groupedByDate = eggRecords.reduce((acc: any, record: any) => {
        const date = record.date.toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = {
                date,
                totalEggs: 0,
                records: [],
            };
        }

        acc[date].totalEggs += record.quantity;
        acc[date].records.push(record);

        return acc;
    }, {});

    // Convert to array
    const report = Object.values(groupedByDate);

    // Calculate total eggs
    const totalEggs = report.reduce((sum: number, day: any) => sum + day.totalEggs, 0);

    res.status(200).json({
        success: true,
        data: {
            totalEggs,
            dailyReport: report,
        },
    });
};

// Get feed consumption report
export const getFeedConsumptionReport = async (req: Request, res: Response) => {
    const { startDate, endDate, penId } = req.query;

    // Build query
    const query: any = { recordType: 'feedConsumption' };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
    }

    if (penId) {
        query.penId = penId;
    }

    // Get feed consumption records
    const feedRecords = await Record.find(query).sort({ date: 1 });

    // Group by date
    const groupedByDate = feedRecords.reduce((acc: any, record: any) => {
        const date = record.date.toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = {
                date,
                totalFeed: 0,
                records: [],
            };
        }

        acc[date].totalFeed += record.quantity;
        acc[date].records.push(record);

        return acc;
    }, {});

    // Convert to array
    const report = Object.values(groupedByDate);

    // Calculate total feed
    const totalFeed = report.reduce((sum: number, day: any) => sum + day.totalFeed, 0);

    res.status(200).json({
        success: true,
        data: {
            totalFeed,
            dailyReport: report,
        },
    });
};

// Get mortality report
export const getMortalityReport = async (req: Request, res: Response) => {
    const { startDate, endDate, penId } = req.query;

    // Build query
    const query: any = { recordType: 'mortality' };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
    }

    if (penId) {
        query.penId = penId;
    }

    // Get mortality records
    const mortalityRecords = await Record.find(query).sort({ date: 1 });

    // Group by date
    const groupedByDate = mortalityRecords.reduce((acc: any, record: any) => {
        const date = record.date.toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = {
                date,
                totalMortality: 0,
                records: [],
            };
        }

        acc[date].totalMortality += record.quantity;
        acc[date].records.push(record);

        return acc;
    }, {});

    // Convert to array
    const report = Object.values(groupedByDate);

    // Calculate total mortality
    const totalMortality = report.reduce((sum: number, day: any) => sum + day.totalMortality, 0);

    res.status(200).json({
        success: true,
        data: {
            totalMortality,
            dailyReport: report,
        },
    });
};

// Get financial report
export const getFinancialReport = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    // Build date query
    const dateQuery: any = {};

    if (startDate && endDate) {
        dateQuery.$gte = new Date(startDate as string);
        dateQuery.$lte = new Date(endDate as string);
    }

    // Get income records (egg sales)
    const incomeRecords = await Record.find({
        recordType: 'income',
        ...(Object.keys(dateQuery).length > 0 && { date: dateQuery }),
    });

    // Get expense records (feed, medication, etc.)
    const expenseRecords = await Record.find({
        recordType: 'expense',
        ...(Object.keys(dateQuery).length > 0 && { date: dateQuery }),
    });

    // Calculate totals
    const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalExpenses = expenseRecords.reduce((sum, record) => sum + record.amount, 0);
    const profit = totalIncome - totalExpenses;

    // Group expenses by category
    const expensesByCategory = expenseRecords.reduce((acc: any, record) => {
        const category = record.category || 'Other';

        if (!acc[category]) {
            acc[category] = 0;
        }

        acc[category] += record.amount;

        return acc;
    }, {});

    res.status(200).json({
        success: true,
        data: {
            totalIncome,
            totalExpenses,
            profit,
            expensesByCategory,
            incomeRecords,
            expenseRecords,
        },
    });
};

// Get performance metrics
export const getPerformanceMetrics = async (req: Request, res: Response) => {
    const { startDate, endDate, penId } = req.query;

    // Build date query
    const dateQuery: any = {};

    if (startDate && endDate) {
        dateQuery.$gte = new Date(startDate as string);
        dateQuery.$lte = new Date(endDate as string);
    }

    // Build pen query
    const penQuery: any = {};

    if (penId) {
        penQuery.penId = penId;
    }

    // Get egg production records
    const eggRecords = await Record.find({
        recordType: 'eggProduction',
        ...(Object.keys(dateQuery).length > 0 && { date: dateQuery }),
        ...penQuery,
    });

    // Get feed consumption records
    const feedRecords = await Record.find({
        recordType: 'feedConsumption',
        ...(Object.keys(dateQuery).length > 0 && { date: dateQuery }),
        ...penQuery,
    });

    // Get mortality records
    const mortalityRecords = await Record.find({
        recordType: 'mortality',
        ...(Object.keys(dateQuery).length > 0 && { date: dateQuery }),
        ...penQuery,
    });

    // Calculate totals
    const totalEggs = eggRecords.reduce((sum, record) => sum + record.quantity, 0);
    const totalFeed = feedRecords.reduce((sum, record) => sum + record.quantity, 0);
    const totalMortality = mortalityRecords.reduce((sum, record) => sum + record.quantity, 0);

    // Calculate feed conversion ratio (FCR)
    const fcr = totalEggs > 0 ? totalFeed / totalEggs : 0;

    // Get total birds
    let totalBirds = 0;

    if (penId) {
        const pen = await Pen.findById(penId);
        totalBirds = pen ? pen.birdCount : 0;
    } else {
        const pens = await Pen.find();
        totalBirds = pens.reduce((sum, pen) => sum + pen.birdCount, 0);
    }

    // Calculate mortality rate
    const mortalityRate = totalBirds > 0 ? (totalMortality / totalBirds) * 100 : 0;

    // Calculate egg production rate (eggs per bird)
    const eggProductionRate = totalBirds > 0 ? totalEggs / totalBirds : 0;

    res.status(200).json({
        success: true,
        data: {
            totalEggs,
            totalFeed,
            totalMortality,
            fcr,
            mortalityRate,
            eggProductionRate,
        },
    });
};