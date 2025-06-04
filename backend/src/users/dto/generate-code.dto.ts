import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class GenerateCodeDto {
  @ApiProperty({ example: true, description: 'Whether to generate a vet code' })
  @IsBoolean({ message: 'isVet must be a boolean' })
  isVet: boolean;

  @ApiProperty({ example: true, description: 'Whether to generate a worker code' })
  @IsBoolean({ message: 'isWorker must be a boolean' })
  isWorker: boolean;

  @ApiProperty({ example: 'Dr. Smith', description: 'Name of the person for whom the code is generated' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}

export class CodeResponseDto {
  @ApiProperty({ example: 'ABC123', description: 'Generated code' })
  code: string;

  @ApiProperty({ example: 'vet', description: 'Type of code generated' })
  type: string;

  @ApiProperty({ example: 'Dr. Smith', description: 'Name of the person for whom the code is generated' })
  name: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Expiration date of the code' })
  expiresAt: Date;
}