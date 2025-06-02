import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export class ReportFilterDto {
  @ApiProperty({ enum: ReportPeriod, example: ReportPeriod.MONTHLY, description: 'Report period', required: false })
  @IsOptional()
  @IsEnum(ReportPeriod, { message: 'Period must be one of: daily, weekly, monthly, custom' })
  period?: ReportPeriod;

  @ApiProperty({ example: '2023-01-01', description: 'Start date for custom period', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate?: string;

  @ApiProperty({ example: '2023-01-31', description: 'End date for custom period', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;
}