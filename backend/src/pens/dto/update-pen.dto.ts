import { PartialType } from '@nestjs/swagger';
import { CreatePenDto } from './create-pen.dto';

export class UpdatePenDto extends PartialType(CreatePenDto) {}