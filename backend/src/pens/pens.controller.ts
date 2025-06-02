import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PensService } from './pens.service';
import { CreatePenDto } from './dto/create-pen.dto';
import { UpdatePenDto } from './dto/update-pen.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Pen } from './schemas/pen.schema';

@ApiTags('Pens')
@Controller('pens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PensController {
  constructor(private readonly pensService: PensService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pen' })
  @ApiResponse({ status: 201, description: 'Pen created successfully', type: Pen })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createPenDto: CreatePenDto, @Request() req): Promise<Pen> {
    return this.pensService.create(createPenDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pens' })
  @ApiResponse({ status: 200, description: 'Return all pens', type: [Pen] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req): Promise<Pen[]> {
    return this.pensService.findAll(req.user.id, req.user.role);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get pen statistics' })
  @ApiResponse({ status: 200, description: 'Return pen statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPenStats(@Request() req): Promise<any> {
    return this.pensService.getPenStats(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pen by ID' })
  @ApiResponse({ status: 200, description: 'Return the pen', type: Pen })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Pen not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<Pen> {
    return this.pensService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pen' })
  @ApiResponse({ status: 200, description: 'Pen updated successfully', type: Pen })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Pen not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePenDto: UpdatePenDto,
    @Request() req,
  ): Promise<Pen> {
    return this.pensService.update(id, updatePenDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pen' })
  @ApiResponse({ status: 204, description: 'Pen deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Pen not found' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.pensService.remove(id, req.user.id, req.user.role);
  }
}