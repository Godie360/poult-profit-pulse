import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Record, RecordType } from './record.schema';

@Schema()
export class MedicineRecord extends Record {
  @ApiProperty({ example: 'Antibiotics', description: 'Name of the medicine' })
  @Prop({ required: true })
  medicine: string;

  @ApiProperty({ example: '20 bottles', description: 'Quantity with unit' })
  @Prop({ required: true })
  quantity: string;

  constructor() {
    super();
    this.recordType = RecordType.MEDICINE;
  }
}

export const MedicineRecordSchema = SchemaFactory.createForClass(MedicineRecord);