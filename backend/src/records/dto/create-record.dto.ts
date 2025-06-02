import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordType } from '../schemas/record.schema';

export class CreateRecordDto {
  @ApiProperty({ example: '2023-01-01', description: 'Date of the record' })
  @IsNotEmpty({ message: 'Date is required' })
  @IsDate({ message: 'Invalid date format' })
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: 5000, description: 'Price in local currency' })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @ApiProperty({ example: 'FarmSupply Co.', description: 'Supplier name' })
  @IsNotEmpty({ message: 'Supplier is required' })
  @IsString({ message: 'Supplier must be a string' })
  supplier: string;

  @ApiProperty({ enum: RecordType, example: RecordType.FEED, description: 'Type of record' })
  @IsNotEmpty({ message: 'Record type is required' })
  @IsEnum(RecordType, { message: 'Record type must be one of: feed, medicine' })
  recordType: RecordType;
}