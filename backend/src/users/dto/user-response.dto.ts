import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../schemas/user.schema';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  _id: string;

  @Expose()
  @ApiProperty({ example: 'John Smith', description: 'User full name' })
  fullName: string;

  @Expose()
  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  email: string;

  @Expose()
  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'johnsmith', description: 'Username for login' })
  username: string;

  @Expose()
  @ApiProperty({ enum: UserRole, example: UserRole.FARMER, description: 'User role' })
  role: UserRole;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last login date' })
  lastLogin: Date;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User creation date' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User last update date' })
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}