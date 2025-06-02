import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateFeedRecordDto } from './dto/create-feed-record.dto';
import { CreateMedicineRecordDto } from './dto/create-medicine-record.dto';
import { UpdateFeedRecordDto } from './dto/update-feed-record.dto';
import { UpdateMedicineRecordDto } from './dto/update-medicine-record.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RecordType } from './schemas/record.schema';

@ApiTags('Records')
@Controller('records')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('feed')
  @ApiOperation({ summary: 'Create a new feed record' })
  @ApiResponse({ status: 201, description: 'Feed record created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createFeedRecord(
    @Body() createFeedRecordDto: CreateFeedRecordDto,
    @Request() req,
  ) {
    return this.recordsService.createFeedRecord(createFeedRecordDto, req.user.id);
  }

  @Post('medicine')
  @ApiOperation({ summary: 'Create a new medicine record' })
  @ApiResponse({ status: 201, description: 'Medicine record created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createMedicineRecord(
    @Body() createMedicineRecordDto: CreateMedicineRecordDto,
    @Request() req,
  ) {
    return this.recordsService.createMedicineRecord(createMedicineRecordDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all records' })
  @ApiResponse({ status: 200, description: 'Return all records' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'type', enum: RecordType, required: false })
  async findAll(@Request() req, @Query('type') type?: RecordType) {
    return this.recordsService.findAll(req.user.id, req.user.role, type);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get record statistics' })
  @ApiResponse({ status: 200, description: 'Return record statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats(@Request() req) {
    return this.recordsService.getRecordStats(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a record by ID' })
  @ApiResponse({ status: 200, description: 'Return the record' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.recordsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch('feed/:id')
  @ApiOperation({ summary: 'Update a feed record' })
  @ApiResponse({ status: 200, description: 'Feed record updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async updateFeedRecord(
    @Param('id') id: string,
    @Body() updateFeedRecordDto: UpdateFeedRecordDto,
    @Request() req,
  ) {
    return this.recordsService.updateFeedRecord(id, updateFeedRecordDto, req.user.id, req.user.role);
  }

  @Patch('medicine/:id')
  @ApiOperation({ summary: 'Update a medicine record' })
  @ApiResponse({ status: 200, description: 'Medicine record updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async updateMedicineRecord(
    @Param('id') id: string,
    @Body() updateMedicineRecordDto: UpdateMedicineRecordDto,
    @Request() req,
  ) {
    return this.recordsService.updateMedicineRecord(id, updateMedicineRecordDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a record' })
  @ApiResponse({ status: 204, description: 'Record deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.recordsService.remove(id, req.user.id, req.user.role);
  }
}