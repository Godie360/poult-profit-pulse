import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordType } from './schemas/record.schema';
import { FeedRecord } from './schemas/feed-record.schema';
import { MedicineRecord } from './schemas/medicine-record.schema';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateFeedRecordDto } from './dto/create-feed-record.dto';
import { CreateMedicineRecordDto } from './dto/create-medicine-record.dto';
import { UpdateFeedRecordDto } from './dto/update-feed-record.dto';
import { UpdateMedicineRecordDto } from './dto/update-medicine-record.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name) private readonly recordModel: Model<Record>,
    @InjectModel(FeedRecord.name) private readonly feedRecordModel: Model<FeedRecord>,
    @InjectModel(MedicineRecord.name) private readonly medicineRecordModel: Model<MedicineRecord>,
  ) {}

  async createFeedRecord(createFeedRecordDto: CreateFeedRecordDto, userId: string): Promise<FeedRecord> {
    const newRecord = new this.feedRecordModel({
      ...createFeedRecordDto,
      recordType: RecordType.FEED,
      owner: userId,
    });
    return newRecord.save();
  }

  async createMedicineRecord(createMedicineRecordDto: CreateMedicineRecordDto, userId: string): Promise<MedicineRecord> {
    const newRecord = new this.medicineRecordModel({
      ...createMedicineRecordDto,
      recordType: RecordType.MEDICINE,
      owner: userId,
    });
    return newRecord.save();
  }

  async findAll(userId: string, userRole: UserRole, recordType?: RecordType): Promise<Record[]> {
    // If user is a farmer, return only their records
    // If user is a worker or vet, return all records
    const query: any = userRole === UserRole.FARMER ? { owner: userId } : {};
    
    // Filter by record type if provided
    if (recordType) {
      query.recordType = recordType;
    }
    
    return this.recordModel.find(query).sort({ date: -1 }).exec();
  }

  async findOne(id: string, userId: string, userRole: UserRole): Promise<Record> {
    const record = await this.recordModel.findById(id).exec();
    
    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    
    // Check if user has access to this record
    if (userRole === UserRole.FARMER && record.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this record');
    }
    
    return record;
  }

  async updateFeedRecord(id: string, updateFeedRecordDto: UpdateFeedRecordDto, userId: string, userRole: UserRole): Promise<FeedRecord> {
    const record = await this.findOne(id, userId, userRole) as FeedRecord;
    
    // Verify this is a feed record
    if (record.recordType !== RecordType.FEED) {
      throw new ForbiddenException('This is not a feed record');
    }
    
    // Only allow updates to records owned by the user if they are a farmer
    if (userRole === UserRole.FARMER && record.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this record');
    }
    
    return this.feedRecordModel.findByIdAndUpdate(
      id,
      updateFeedRecordDto,
      { new: true }
    ).exec();
  }

  async updateMedicineRecord(id: string, updateMedicineRecordDto: UpdateMedicineRecordDto, userId: string, userRole: UserRole): Promise<MedicineRecord> {
    const record = await this.findOne(id, userId, userRole) as MedicineRecord;
    
    // Verify this is a medicine record
    if (record.recordType !== RecordType.MEDICINE) {
      throw new ForbiddenException('This is not a medicine record');
    }
    
    // Only allow updates to records owned by the user if they are a farmer
    if (userRole === UserRole.FARMER && record.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this record');
    }
    
    return this.medicineRecordModel.findByIdAndUpdate(
      id,
      updateMedicineRecordDto,
      { new: true }
    ).exec();
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const record = await this.findOne(id, userId, userRole);
    
    // Only allow deletion of records owned by the user if they are a farmer
    if (userRole === UserRole.FARMER && record.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this record');
    }
    
    await this.recordModel.findByIdAndDelete(id).exec();
  }

  async getRecordStats(userId: string, userRole: UserRole): Promise<any> {
    const query = userRole === UserRole.FARMER ? { owner: userId } : {};
    
    const [feedRecords, medicineRecords] = await Promise.all([
      this.recordModel.find({ ...query, recordType: RecordType.FEED }).exec(),
      this.recordModel.find({ ...query, recordType: RecordType.MEDICINE }).exec(),
    ]);
    
    const totalFeedExpense = feedRecords.reduce((sum, record) => sum + record.price, 0);
    const totalMedicineExpense = medicineRecords.reduce((sum, record) => sum + record.price, 0);
    const totalExpense = totalFeedExpense + totalMedicineExpense;
    
    // Get recent records
    const recentRecords = await this.recordModel
      .find(query)
      .sort({ date: -1 })
      .limit(5)
      .exec();
    
    return {
      totalRecords: feedRecords.length + medicineRecords.length,
      totalExpense,
      feedExpense: totalFeedExpense,
      medicineExpense: totalMedicineExpense,
      recordsByType: {
        feed: feedRecords.length,
        medicine: medicineRecords.length,
      },
      recentRecords,
    };
  }
}