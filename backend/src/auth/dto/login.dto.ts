import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email or username' })
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString({ message: 'Email or username must be a string' })
  readonly emailOrUsername: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string;
}