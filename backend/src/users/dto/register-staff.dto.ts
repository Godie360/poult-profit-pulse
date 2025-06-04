import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class RegisterStaffDto {
  @ApiProperty({ example: 'John Smith', description: 'User full name' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(3, { message: 'Full name must be at least 3 characters' })
  fullName: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @MinLength(10, { message: 'Phone number must be at least 10 characters' })
  phone: string;

  @ApiProperty({ example: 'johnsmith', description: 'Username for login' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  @ApiProperty({ example: true, description: 'Whether user has vet access' })
  @IsOptional()
  @IsBoolean({ message: 'isVet must be a boolean' })
  isVet?: boolean;

  @ApiProperty({ example: true, description: 'Whether user has worker access' })
  @IsOptional()
  @IsBoolean({ message: 'isWorker must be a boolean' })
  isWorker?: boolean;

  @ApiProperty({ example: 'ABC123', description: 'Special code for vet access' })
  @IsOptional()
  @IsString({ message: 'Vet code must be a string' })
  vetCode?: string;

  @ApiProperty({ example: 'XYZ789', description: 'Special code for worker access' })
  @IsOptional()
  @IsString({ message: 'Worker code must be a string' })
  workerCode?: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}