import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum CodeType {
  VET = 'vet',
  WORKER = 'worker',
}

@Schema({ timestamps: true })
export class AccessCode extends Document {
  @ApiProperty({ example: 'ABC123', description: 'Unique access code' })
  @Prop({ required: true, unique: true })
  code: string;

  @ApiProperty({ enum: CodeType, example: CodeType.VET, description: 'Type of access code' })
  @Prop({ required: true, enum: CodeType })
  type: CodeType;

  @ApiProperty({ example: 'Dr. Smith', description: 'Name of the person for whom the code is generated' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'ID of the farmer who generated the code' })
  @Prop({ required: true })
  generatedBy: string;

  @ApiProperty({ example: false, description: 'Whether the code has been used' })
  @Prop({ default: false })
  used: boolean;

  @ApiProperty({ example: '60d0fe4f5311236168a109cb', description: 'ID of the user who used the code' })
  @Prop()
  usedBy: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Date when the code was used' })
  @Prop()
  usedAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Expiration date of the code' })
  @Prop({ required: true })
  expiresAt: Date;
}

export const AccessCodeSchema = SchemaFactory.createForClass(AccessCode);