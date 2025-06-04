import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, AccessType } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';
import { VetWorkerDataDto } from './dto/vet-worker-data.dto';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { DailyLog } from './schemas/daily-log.schema';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('vet-worker-data')
  @ApiOperation({ summary: 'Get combined vet and worker data for the farmer dashboard' })
  @ApiResponse({ status: 200, description: 'Return combined vet and worker data', type: VetWorkerDataDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(RolesGuard)
  @Roles(AccessType.FARMER)
  async getVetWorkerData(@Request() req): Promise<VetWorkerDataDto> {
    return this.dashboardService.getVetWorkerData(req.user.id, req.user.role);
  }

  @Post('daily-log')
  @ApiOperation({ summary: 'Create a new daily log' })
  @ApiResponse({ status: 201, description: 'Daily log created successfully', type: DailyLog })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only workers and farmers can create daily logs' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccessType.FARMER, AccessType.WORKER)
  async createDailyLog(@Body() createDailyLogDto: CreateDailyLogDto, @Request() req): Promise<DailyLog> {
    return this.dashboardService.createDailyLog(createDailyLogDto, req.user.id, req.user.registeredBy);
  }

  @Get('daily-logs')
  @ApiOperation({ summary: 'Get daily logs for the current user' })
  @ApiResponse({ status: 200, description: 'Return daily logs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getUserDailyLogs(@Request() req): Promise<DailyLog[]> {
    return this.dashboardService.getUserDailyLogs(req.user.id, req.user.role);
  }
}
