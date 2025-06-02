import { PartialType } from '@nestjs/swagger';
import { CreateMedicineRecordDto } from './create-medicine-record.dto';

export class UpdateMedicineRecordDto extends PartialType(CreateMedicineRecordDto) {}