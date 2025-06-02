import { PartialType } from '@nestjs/swagger';
import { CreateFeedRecordDto } from './create-feed-record.dto';

export class UpdateFeedRecordDto extends PartialType(CreateFeedRecordDto) {}