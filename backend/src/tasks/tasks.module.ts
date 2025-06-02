import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportCalculatorService } from './report-calculator.service';
import { ReportsModule } from '../reports/reports.module';
import { RecordsModule } from '../records/records.module';
import { PensModule } from '../pens/pens.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ReportsModule,
    RecordsModule,
    PensModule,
  ],
  providers: [ReportCalculatorService],
  exports: [ReportCalculatorService],
})
export class TasksModule {}