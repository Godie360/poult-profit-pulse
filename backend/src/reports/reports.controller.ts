import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
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
    return this.reportsService.getFinancialReport(req.user.id, req.user.role, filter);
  }

  @Get('production')
  @ApiOperation({ summary: 'Get production report' })
  @ApiResponse({ status: 200, description: 'Return production report data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProductionReport(
    @Request() req,
    @Query() filter: ReportFilterDto,
  ) {
    return this.reportsService.getProductionReport(req.user.id, req.user.role, filter);
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
      this.reportsService.getFinancialReport(req.user.id, req.user.role, filter),
      this.reportsService.getProductionReport(req.user.id, req.user.role, filter),
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
  @Roles(UserRole.FARMER)
  @ApiOperation({ summary: 'Export reports data' })
  @ApiResponse({ status: 200, description: 'Return data for export' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async exportReports(
    @Request() req,
    @Query() filter: ReportFilterDto,
  ) {
    const [financialReport, productionReport] = await Promise.all([
      this.reportsService.getFinancialReport(req.user.id, req.user.role, filter),
      this.reportsService.getProductionReport(req.user.id, req.user.role, filter),
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
}