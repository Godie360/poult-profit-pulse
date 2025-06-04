import { Injectable } from '@nestjs/common';
import { PensService } from '../pens/pens.service';
import { RecordsService } from '../records/records.service';
import { ReportFilterDto, ReportPeriod } from './dto/report-filter.dto';
import { RecordType } from '../records/schemas/record.schema';
import { UserRole } from '../users/schemas/user.schema';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(
    private readonly pensService: PensService,
    private readonly recordsService: RecordsService,
  ) {}

  async getFinancialReport(userId: string, userRole: UserRole, filter: ReportFilterDto, isWorker: boolean = false, isVet: boolean = false): Promise<any> {
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

  async getProductionReport(userId: string, userRole: UserRole, filter: ReportFilterDto, isWorker: boolean = false, isVet: boolean = false): Promise<any> {
    // Get date range based on filter
    const { startDate, endDate } = this.getDateRange(filter);

    // Get pen statistics
    const penStats = await this.pensService.getPenStats(userId, userRole, isWorker, isVet);

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

  /**
   * Generate an Excel file with financial and production reports
   * @param financialReport The financial report data
   * @param productionReport The production report data
   * @param userName The name of the user generating the report
   * @returns Buffer containing the Excel file
   */
  async generateExcelReport(financialReport: any, productionReport: any, userName: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = userName;
    workbook.created = new Date();
    workbook.modified = new Date();

    // Add financial report sheet
    const financialSheet = workbook.addWorksheet('Financial Report');

    // Add title and date range
    financialSheet.mergeCells('A1:F1');
    financialSheet.getCell('A1').value = 'Poult Profit Pulse - Financial Report';
    financialSheet.getCell('A1').font = { size: 16, bold: true };
    financialSheet.getCell('A1').alignment = { horizontal: 'center' };

    financialSheet.mergeCells('A2:F2');
    financialSheet.getCell('A2').value = `Period: ${financialReport.startDate} to ${financialReport.endDate}`;
    financialSheet.getCell('A2').font = { size: 12, italic: true };
    financialSheet.getCell('A2').alignment = { horizontal: 'center' };

    // Add financial summary
    financialSheet.addRow([]);
    financialSheet.addRow(['Financial Summary']);
    financialSheet.getRow(4).font = { bold: true };

    financialSheet.addRow(['Total Expense', financialReport.financialSummary.totalExpense, 'TSH']);
    financialSheet.addRow(['Total Income', financialReport.financialSummary.totalIncome, 'TSH']);
    financialSheet.addRow(['Profit', financialReport.financialSummary.profit, 'TSH']);

    // Add expense breakdown
    financialSheet.addRow([]);
    financialSheet.addRow(['Expense Breakdown']);
    financialSheet.getRow(9).font = { bold: true };

    financialSheet.addRow(['Feed', financialReport.financialSummary.expenseBreakdown.feed, 'TSH']);
    financialSheet.addRow(['Medicine', financialReport.financialSummary.expenseBreakdown.medicine, 'TSH']);

    // Add record counts
    financialSheet.addRow([]);
    financialSheet.addRow(['Record Counts']);
    financialSheet.getRow(13).font = { bold: true };

    financialSheet.addRow(['Total Records', financialReport.recordCounts.total]);
    financialSheet.addRow(['Feed Records', financialReport.recordCounts.feed]);
    financialSheet.addRow(['Medicine Records', financialReport.recordCounts.medicine]);

    // Format columns
    financialSheet.getColumn('A').width = 20;
    financialSheet.getColumn('B').width = 15;
    financialSheet.getColumn('C').width = 10;

    // Add production report sheet
    const productionSheet = workbook.addWorksheet('Production Report');

    // Add title and date range
    productionSheet.mergeCells('A1:F1');
    productionSheet.getCell('A1').value = 'Poult Profit Pulse - Production Report';
    productionSheet.getCell('A1').font = { size: 16, bold: true };
    productionSheet.getCell('A1').alignment = { horizontal: 'center' };

    productionSheet.mergeCells('A2:F2');
    productionSheet.getCell('A2').value = `Period: ${productionReport.startDate} to ${productionReport.endDate}`;
    productionSheet.getCell('A2').font = { size: 12, italic: true };
    productionSheet.getCell('A2').alignment = { horizontal: 'center' };

    // Add production summary
    productionSheet.addRow([]);
    productionSheet.addRow(['Production Summary']);
    productionSheet.getRow(4).font = { bold: true };

    productionSheet.addRow(['Total Birds', productionReport.productionSummary.totalBirds]);
    productionSheet.addRow(['Eggs Produced', productionReport.productionSummary.eggsProduced]);
    productionSheet.addRow(['Eggs Sold', productionReport.productionSummary.eggsSold]);
    productionSheet.addRow(['Mortality Rate', productionReport.productionSummary.mortality, '%']);

    // Add pen summary
    productionSheet.addRow([]);
    productionSheet.addRow(['Pen Summary']);
    productionSheet.getRow(10).font = { bold: true };

    productionSheet.addRow(['Total Pens', productionReport.penSummary.totalPens]);
    productionSheet.addRow(['Layers', productionReport.penSummary.pensByType.layers]);
    productionSheet.addRow(['Broilers', productionReport.penSummary.pensByType.broilers]);
    productionSheet.addRow(['Chicks', productionReport.penSummary.pensByType.chicks]);

    // Format columns
    productionSheet.getColumn('A').width = 20;
    productionSheet.getColumn('B').width = 15;
    productionSheet.getColumn('C').width = 10;

    // Generate buffer
    return await workbook.xlsx.writeBuffer() as unknown as Buffer;
  }
}
