import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Record, RecordType } from './record.schema';

export enum FeedType {
  LAYER_FEED = 'Layer Feed',
  BROILER_FEED = 'Broiler Feed',
  CHICK_STARTER = 'Chick Starter',
  GROWER_FEED = 'Grower Feed',
}

@Schema()
export class FeedRecord extends Record {
  @ApiProperty({ enum: FeedType, example: FeedType.LAYER_FEED, description: 'Type of feed' })
  @Prop({ required: true, enum: FeedType })
  feedType: FeedType;

  @ApiProperty({ example: 500, description: 'Quantity in kilograms' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  constructor() {
    super();
    this.recordType = RecordType.FEED;
  }
}

export const FeedRecordSchema = SchemaFactory.createForClass(FeedRecord);