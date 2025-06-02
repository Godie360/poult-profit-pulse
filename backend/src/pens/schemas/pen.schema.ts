import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';

export enum PenType {
  LAYERS = 'Layers',
  BROILERS = 'Broilers',
  CHICKS = 'Chicks',
}

export enum PenStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Pen extends Document {
  @ApiProperty({ example: 'Pen #1', description: 'Pen name or identifier' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 250, description: 'Number of birds in the pen' })
  @Prop({ required: true, min: 1 })
  birdCount: number;

  @ApiProperty({ enum: PenType, example: PenType.LAYERS, description: 'Type of birds in the pen' })
  @Prop({ required: true, enum: PenType })
  type: PenType;

  @ApiProperty({ example: 12, description: 'Age of birds in weeks' })
  @Prop({ required: true, min: 0 })
  age: number;

  @ApiProperty({ example: 190, description: 'Average daily egg production' })
  @Prop({ default: 0 })
  dailyEggAvg: number;

  @ApiProperty({ example: 1.2, description: 'Mortality rate percentage' })
  @Prop({ default: 0 })
  mortality: number;

  @ApiProperty({ enum: PenStatus, example: PenStatus.ACTIVE, description: 'Current status of the pen' })
  @Prop({ required: true, enum: PenStatus, default: PenStatus.ACTIVE })
  status: PenStatus;

  @ApiProperty({ description: 'User who owns this pen' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;
}

export const PenSchema = SchemaFactory.createForClass(Pen);