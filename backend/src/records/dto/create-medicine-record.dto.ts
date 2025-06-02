import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRecordDto } from './create-record.dto';
import { RecordType } from '../schemas/record.schema';

export class CreateMedicineRecordDto extends CreateRecordDto {
  @ApiProperty({ example: 'Antibiotics', description: 'Name of the medicine' })
  @IsNotEmpty({ message: 'Medicine name is required' })
  @IsString({ message: 'Medicine name must be a string' })
  medicine: string;

  @ApiProperty({ example: '20 bottles', description: 'Quantity with unit' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsString({ message: 'Quantity must be a string' })
  quantity: string;

  constructor() {
    super();
    this.recordType = RecordType.MEDICINE;
  }
}