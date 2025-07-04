import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
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

  @ApiProperty({ enum: UserRole, example: UserRole.FARMER, description: 'User role' })
  @IsEnum(UserRole, { message: 'Role must be farmer' })
  role: UserRole = UserRole.FARMER;

  @ApiProperty({ example: 'ABC123', description: 'Special code for vet access' })
  @IsOptional()
  @IsString({ message: 'Vet code must be a string' })
  vetCode?: string;

  @ApiProperty({ example: 'XYZ789', description: 'Special code for worker access' })
  @IsOptional()
  @IsString({ message: 'Worker code must be a string' })
  workerCode?: string;

  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'ID of the farmer who registered this user' })
  @IsOptional()
  @IsString({ message: 'RegisteredBy must be a string' })
  registeredBy?: string;

  @ApiProperty({ example: false, description: 'Whether user has worker access' })
  @IsOptional()
  @IsBoolean({ message: 'isWorker must be a boolean' })
  isWorker?: boolean;

  @ApiProperty({ example: false, description: 'Whether user has vet access' })
  @IsOptional()
  @IsBoolean({ message: 'isVet must be a boolean' })
  isVet?: boolean;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  // Temporarily removed regex validation for testing
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
  //   message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  // })
  password: string;
}
