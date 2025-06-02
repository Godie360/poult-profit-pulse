import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PensService } from './pens.service';
import { PensController } from './pens.controller';
import { Pen, PenSchema } from './schemas/pen.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pen.name, schema: PenSchema }]),
  ],
  controllers: [PensController],
  providers: [PensService],
  exports: [PensService],
})
export class PensModule {}