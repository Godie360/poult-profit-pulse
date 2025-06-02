import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PensModule } from '../pens/pens.module';
import { RecordsModule } from '../records/records.module';

@Module({
  imports: [
    PensModule,
    RecordsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}