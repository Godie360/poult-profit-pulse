import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportsService } from '../reports/reports.service';
import { RecordsService } from '../records/records.service';
import { PensService } from '../pens/pens.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class ReportCalculatorService {
  private readonly logger = new Logger(ReportCalculatorService.name);

  constructor(
    private readonly reportsService: ReportsService,
    private readonly recordsService: RecordsService,
    private readonly pensService: PensService,
  ) {}

  /**
   * Calculate reports daily at midnight
   * This will process all records from the previous day and update the reports
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateDailyReports() {
    this.logger.log('Starting daily report calculations...');
    
    try {
      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Create filter for yesterday's data
      const filter = {
        startDate: yesterday.toISOString(),
        endDate: today.toISOString(),
      };
      
      // Get all users with FARMER role (system admin)
      // In a real implementation, you would fetch all farmers from the database
      // For now, we'll use a dummy admin user ID
      const adminUserId = 'admin';
      
      // Calculate reports for the admin user
      await this.reportsService.getFinancialReport(adminUserId, UserRole.FARMER, filter);
      await this.reportsService.getProductionReport(adminUserId, UserRole.FARMER, filter);
      
      this.logger.log('Daily report calculations completed successfully');
    } catch (error) {
      this.logger.error(`Error calculating daily reports: ${error.message}`, error.stack);
    }
  }
  
  /**
   * Calculate reports weekly on Sunday at midnight
   * This will process all records from the previous week and update the reports
   */
  @Cron(CronExpression.EVERY_WEEK)
  async calculateWeeklyReports() {
    this.logger.log('Starting weekly report calculations...');
    
    try {
      // Get last week's date range
      const endDate = new Date();
      endDate.setHours(0, 0, 0, 0);
      
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      
      // Create filter for last week's data
      const filter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      
      // Get all users with FARMER role (system admin)
      // In a real implementation, you would fetch all farmers from the database
      // For now, we'll use a dummy admin user ID
      const adminUserId = 'admin';
      
      // Calculate reports for the admin user
      await this.reportsService.getFinancialReport(adminUserId, UserRole.FARMER, filter);
      await this.reportsService.getProductionReport(adminUserId, UserRole.FARMER, filter);
      
      this.logger.log('Weekly report calculations completed successfully');
    } catch (error) {
      this.logger.error(`Error calculating weekly reports: ${error.message}`, error.stack);
    }
  }
  
  /**
   * Calculate reports monthly on the 1st day of each month at midnight
   * This will process all records from the previous month and update the reports
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async calculateMonthlyReports() {
    this.logger.log('Starting monthly report calculations...');
    
    try {
      // Get last month's date range
      const endDate = new Date();
      endDate.setDate(1);
      endDate.setHours(0, 0, 0, 0);
      
      const startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 1);
      
      // Create filter for last month's data
      const filter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      
      // Get all users with FARMER role (system admin)
      // In a real implementation, you would fetch all farmers from the database
      // For now, we'll use a dummy admin user ID
      const adminUserId = 'admin';
      
      // Calculate reports for the admin user
      await this.reportsService.getFinancialReport(adminUserId, UserRole.FARMER, filter);
      await this.reportsService.getProductionReport(adminUserId, UserRole.FARMER, filter);
      
      this.logger.log('Monthly report calculations completed successfully');
    } catch (error) {
      this.logger.error(`Error calculating monthly reports: ${error.message}`, error.stack);
    }
  }
}