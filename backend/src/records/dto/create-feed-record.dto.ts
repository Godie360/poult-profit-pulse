import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CreateRecordDto } from './create-record.dto';
import { FeedType } from '../schemas/feed-record.schema';
import { RecordType } from '../schemas/record.schema';

export class CreateFeedRecordDto extends CreateRecordDto {
  @ApiProperty({ enum: FeedType, example: FeedType.LAYER_FEED, description: 'Type of feed' })
  @IsNotEmpty({ message: 'Feed type is required' })
  @IsEnum(FeedType, { message: 'Feed type must be one of the valid types' })
  feedType: FeedType;

  @ApiProperty({ example: 500, description: 'Quantity in kilograms' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  constructor() {
    super();
    this.recordType = RecordType.FEED;
  }
}