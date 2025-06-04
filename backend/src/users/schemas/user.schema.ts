import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  FARMER = 'farmer',
}

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({ example: 'John Smith', description: 'User full name' })
  @Prop({ required: true })
  fullName: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ example: 'johnsmith', description: 'Username for login' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ enum: UserRole, example: UserRole.FARMER, description: 'User role' })
  @Prop({ required: true, enum: UserRole, default: UserRole.FARMER })
  role: UserRole;

  @ApiProperty({ example: 'ABC123', description: 'Special code for vet access' })
  @Prop()
  vetCode: string;

  @ApiProperty({ example: 'XYZ789', description: 'Special code for worker access' })
  @Prop()
  workerCode: string;

  @ApiProperty({ example: false, description: 'Whether user has vet access' })
  @Prop({ default: false })
  isVet: boolean;

  @ApiProperty({ example: false, description: 'Whether user has worker access' })
  @Prop({ default: false })
  isWorker: boolean;

  @ApiProperty({ example: null, description: 'ID of the farmer who registered this user' })
  @Prop()
  registeredBy: string;

  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last login date' })
  @Prop()
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
