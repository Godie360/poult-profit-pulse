import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';

export enum RecordType {
  FEED = 'feed',
  MEDICINE = 'medicine',
}

@Schema({ timestamps: true, discriminatorKey: '__t' })
export class Record extends Document {
  @ApiProperty({ example: '2023-01-01', description: 'Date of the record' })
  @Prop({ required: true, type: Date })
  date: Date;

  @ApiProperty({ example: 5000, description: 'Price in local currency' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ example: 'FarmSupply Co.', description: 'Supplier name' })
  @Prop({ required: true })
  supplier: string;

  @ApiProperty({ enum: RecordType, example: RecordType.FEED, description: 'Type of record' })
  @Prop({ required: true, enum: RecordType })
  recordType: RecordType;

  @ApiProperty({ description: 'User who created this record' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
