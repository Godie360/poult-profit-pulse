import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDailyLogDto {
  @ApiProperty({ example: '2023-01-01', description: 'Date of the log' })
  @IsNotEmpty({ message: 'Date is required' })
  @IsDate({ message: 'Invalid date format' })
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Pen ID' })
  @IsNotEmpty({ message: 'Pen ID is required' })
  @IsString({ message: 'Pen ID must be a string' })
  penId: string;

  @ApiProperty({ example: 245, description: 'Number of eggs collected' })
  @IsNotEmpty({ message: 'Eggs collected is required' })
  @IsNumber({}, { message: 'Eggs collected must be a number' })
  @Min(0, { message: 'Eggs collected must be a positive number' })
  eggsCollected: number;

  @ApiProperty({ example: 2, description: 'Number of poultry deaths' })
  @IsNotEmpty({ message: 'Poultry deaths is required' })
  @IsNumber({}, { message: 'Poultry deaths must be a number' })
  @Min(0, { message: 'Poultry deaths must be a positive number' })
  poultryDeaths: number;

  @ApiProperty({ example: 5, description: 'Number of poultry sold', required: false })
  @IsNumber({}, { message: 'Poultry sold must be a number' })
  @Min(0, { message: 'Poultry sold must be a positive number' })
  poultrySold?: number;

  @ApiProperty({ example: 75000, description: 'Sales amount in local currency', required: false })
  @IsNumber({}, { message: 'Sales amount must be a number' })
  @Min(0, { message: 'Sales amount must be a positive number' })
  salesAmount?: number;
}