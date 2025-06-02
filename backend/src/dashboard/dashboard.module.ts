import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DailyLog, DailyLogSchema } from './schemas/daily-log.schema';
import { RecordsModule } from '../records/records.module';
import { PensModule } from '../pens/pens.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyLog.name, schema: DailyLogSchema },
    ]),
    RecordsModule,
    PensModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}