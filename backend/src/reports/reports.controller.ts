import { Controller, Get, Query, UseGuards, Request, Res, Header } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, AccessType } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial')
  @ApiOperation({ summary: 'Get financial report' })
  @ApiResponse({ status: 200, description: 'Return financial report data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFinancialReport(
    @Request() req,
    @Query() filter: ReportFilterDto,
  ) {
    return this.reportsService.getFinancialReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet);
  }

  @Get('production')
  @ApiOperation({ summary: 'Get production report' })
  @ApiResponse({ status: 200, description: 'Return production report data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProductionReport(
    @Request() req,
    @Query() filter: ReportFilterDto,
  ) {
    return this.reportsService.getProductionReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary data' })
  @ApiResponse({ status: 200, description: 'Return dashboard summary data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboardSummary(@Request() req) {
    // Get current month data for dashboard
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const filter: ReportFilterDto = {
      startDate: firstDayOfMonth.toISOString().split('T')[0],
      endDate: currentDate.toISOString().split('T')[0],
    };

    const [financialReport, productionReport] = await Promise.all([
      this.reportsService.getFinancialReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet),
      this.reportsService.getProductionReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet),
    ]);

    return {
      financialSummary: financialReport.financialSummary,
      productionSummary: productionReport.productionSummary,
      period: {
        startDate: filter.startDate,
        endDate: filter.endDate,
      },
    };
  }

  @Get('export')
  @UseGuards(RolesGuard)
  @Roles(AccessType.FARMER)
  @ApiOperation({ summary: 'Export reports data as JSON' })
  @ApiResponse({ status: 200, description: 'Return data for export' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async exportReports(
    @Request() req,
    @Query() filter: ReportFilterDto,
  ) {
    const [financialReport, productionReport] = await Promise.all([
      this.reportsService.getFinancialReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet),
      this.reportsService.getProductionReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet),
    ]);

    return {
      financialReport,
      productionReport,
      exportedAt: new Date().toISOString(),
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }

  @Get('download')
  @UseGuards(RolesGuard)
  @Roles(AccessType.FARMER)
  @ApiOperation({ summary: 'Download reports as Excel file' })
  @ApiResponse({ status: 200, description: 'Returns Excel file for download' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async downloadReports(
    @Request() req,
    @Query() filter: ReportFilterDto,
    @Res() res: Response,
  ) {
    // Get report data
    const [financialReport, productionReport] = await Promise.all([
      this.reportsService.getFinancialReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet),
      this.reportsService.getProductionReport(req.user.id, req.user.role, filter, req.user.isWorker, req.user.isVet),
    ]);

    // Generate Excel file
    const buffer = await this.reportsService.generateExcelReport(
      financialReport,
      productionReport,
      req.user.username || req.user.email
    );

    // Format date for filename
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Set headers for file download
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="poultry-report-${dateStr}.xlsx"`,
      'Content-Length': buffer.length,
    });

    // Send the file
    res.end(buffer);
  }
}
