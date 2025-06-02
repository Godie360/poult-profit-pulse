import { Injectable } from '@nestjs/common';
import { PensService } from '../pens/pens.service';
import { RecordsService } from '../records/records.service';
import { ReportFilterDto, ReportPeriod } from './dto/report-filter.dto';
import { RecordType } from '../records/schemas/record.schema';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class ReportsService {
  constructor(
    private readonly pensService: PensService,
    private readonly recordsService: RecordsService,
  ) {}

  async getFinancialReport(userId: string, userRole: UserRole, filter: ReportFilterDto): Promise<any> {
    // Get date range based on filter
    const { startDate, endDate } = this.getDateRange(filter);
    
    // Get all records within date range
    const records = await this.recordsService.findAll(userId, userRole);
    
    // Filter records by date range
    const filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
    
    // Calculate financial metrics
    const feedRecords = filteredRecords.filter(record => record.recordType === RecordType.FEED);
    const medicineRecords = filteredRecords.filter(record => record.recordType === RecordType.MEDICINE);
    
    const feedExpense = feedRecords.reduce((sum, record) => sum + record.price, 0);
    const medicineExpense = medicineRecords.reduce((sum, record) => sum + record.price, 0);
    const totalExpense = feedExpense + medicineExpense;
    
    // In a real application, we would also calculate income from egg sales
    // For now, we'll use a mock value
    const mockIncome = totalExpense * 1.5; // Assume 50% profit margin
    const profit = mockIncome - totalExpense;
    
    return {
      period: filter.period || ReportPeriod.MONTHLY,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      financialSummary: {
        totalExpense,
        totalIncome: mockIncome,
        profit,
        expenseBreakdown: {
          feed: feedExpense,
          medicine: medicineExpense,
        },
      },
      recordCounts: {
        total: filteredRecords.length,
        feed: feedRecords.length,
        medicine: medicineRecords.length,
      },
    };
  }

  async getProductionReport(userId: string, userRole: UserRole, filter: ReportFilterDto): Promise<any> {
    // Get date range based on filter
    const { startDate, endDate } = this.getDateRange(filter);
    
    // Get pen statistics
    const penStats = await this.pensService.getPenStats(userId, userRole);
    
    // In a real application, we would fetch egg production data from a database
    // For now, we'll use mock data
    const mockEggsProduced = penStats.totalBirds * 0.8 * this.getDaysBetween(startDate, endDate);
    const mockEggsSold = mockEggsProduced * 0.95; // Assume 95% of eggs are sold
    
    return {
      period: filter.period || ReportPeriod.MONTHLY,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      productionSummary: {
        totalBirds: penStats.totalBirds,
        eggsProduced: Math.round(mockEggsProduced),
        eggsSold: Math.round(mockEggsSold),
        mortality: penStats.avgMortality,
      },
      penSummary: {
        totalPens: penStats.totalPens,
        pensByType: penStats.pensByType,
      },
    };
  }

  private getDateRange(filter: ReportFilterDto): { startDate: Date; endDate: Date } {
    const endDate = filter.endDate ? new Date(filter.endDate) : new Date();
    let startDate: Date;
    
    if (filter.startDate) {
      startDate = new Date(filter.startDate);
    } else {
      startDate = new Date(endDate);
      
      switch (filter.period) {
        case ReportPeriod.DAILY:
          startDate.setDate(startDate.getDate() - 1);
          break;
        case ReportPeriod.WEEKLY:
          startDate.setDate(startDate.getDate() - 7);
          break;
        case ReportPeriod.MONTHLY:
        default:
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }
    }
    
    return { startDate, endDate };
  }

  private getDaysBetween(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}