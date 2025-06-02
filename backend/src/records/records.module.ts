import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { Record, RecordSchema } from './schemas/record.schema';
import { FeedRecord, FeedRecordSchema } from './schemas/feed-record.schema';
import { MedicineRecord, MedicineRecordSchema } from './schemas/medicine-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Record.name, 
        schema: RecordSchema,
        discriminators: [
          { name: FeedRecord.name, schema: FeedRecordSchema },
          { name: MedicineRecord.name, schema: MedicineRecordSchema },
        ],
      },
    ]),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}