import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { Pen } from '../../pens/schemas/pen.schema';

@Schema({ timestamps: true })
export class DailyLog extends Document {
  @ApiProperty({ example: '2023-01-01', description: 'Date of the log' })
  @Prop({ required: true, type: Date })
  date: Date;

  @ApiProperty({ description: 'Pen reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pen', required: true })
  pen: Pen;

  @ApiProperty({ example: 245, description: 'Number of eggs collected' })
  @Prop({ required: true, min: 0 })
  eggsCollected: number;

  @ApiProperty({ example: 2, description: 'Number of poultry deaths' })
  @Prop({ required: true, min: 0 })
  poultryDeaths: number;

  @ApiProperty({ example: 5, description: 'Number of poultry sold' })
  @Prop({ default: 0, min: 0 })
  poultrySold: number;

  @ApiProperty({ example: 75000, description: 'Sales amount in local currency' })
  @Prop({ default: 0, min: 0 })
  salesAmount: number;

  @ApiProperty({ description: 'User who created this log' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;
}

export const DailyLogSchema = SchemaFactory.createForClass(DailyLog);