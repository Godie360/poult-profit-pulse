import { ApiProperty } from '@nestjs/swagger';
import { MedicineRecord } from '../../records/schemas/medicine-record.schema';

export class DailyLogDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Daily log ID' })
  _id?: string;

  @ApiProperty({ example: '2023-01-01', description: 'Date of the log' })
  date: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Pen ID' })
  penId: string;

  @ApiProperty({ example: 'Pen #1', description: 'Pen name', required: false })
  penName?: string;

  @ApiProperty({ example: 245, description: 'Number of eggs collected' })
  eggsCollected: number;

  @ApiProperty({ example: 2, description: 'Number of poultry deaths' })
  poultryDeaths: number;

  @ApiProperty({ example: 5, description: 'Number of poultry sold', required: false })
  poultrySold?: number;

  @ApiProperty({ example: 75000, description: 'Sales amount in local currency', required: false })
  salesAmount?: number;
}

export class VetWorkerDataDto {
  @ApiProperty({ type: [MedicineRecord], description: 'Recent treatments from veterinarians' })
  treatments: MedicineRecord[];

  @ApiProperty({ type: [DailyLogDto], description: 'Recent daily logs from poultry workers' })
  dailyLogs: DailyLogDto[];
}