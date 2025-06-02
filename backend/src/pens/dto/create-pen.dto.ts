import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PenStatus, PenType } from '../schemas/pen.schema';

export class CreatePenDto {
  @ApiProperty({ example: 'Pen #1', description: 'Pen name or identifier' })
  @IsNotEmpty({ message: 'Pen name is required' })
  @IsString({ message: 'Pen name must be a string' })
  name: string;

  @ApiProperty({ example: 250, description: 'Number of birds in the pen' })
  @IsNotEmpty({ message: 'Bird count is required' })
  @IsNumber({}, { message: 'Bird count must be a number' })
  @Min(1, { message: 'Bird count must be at least 1' })
  birdCount: number;

  @ApiProperty({ enum: PenType, example: PenType.LAYERS, description: 'Type of birds in the pen' })
  @IsNotEmpty({ message: 'Pen type is required' })
  @IsEnum(PenType, { message: 'Pen type must be one of: Layers, Broilers, Chicks' })
  type: PenType;

  @ApiProperty({ example: 12, description: 'Age of birds in weeks' })
  @IsNotEmpty({ message: 'Age is required' })
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(0, { message: 'Age must be a positive number' })
  age: number;

  @ApiProperty({ example: 190, description: 'Average daily egg production', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Daily egg average must be a number' })
  @Min(0, { message: 'Daily egg average must be a positive number' })
  dailyEggAvg?: number;

  @ApiProperty({ example: 1.2, description: 'Mortality rate percentage', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Mortality rate must be a number' })
  @Min(0, { message: 'Mortality rate must be a positive number' })
  mortality?: number;

  @ApiProperty({ enum: PenStatus, example: PenStatus.ACTIVE, description: 'Current status of the pen', required: false })
  @IsOptional()
  @IsEnum(PenStatus, { message: 'Status must be one of: active, inactive' })
  status?: PenStatus;
}