import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordsService } from '../records/records.service';
import { PensService } from '../pens/pens.service';
import { DailyLog } from './schemas/daily-log.schema';
import { VetWorkerDataDto } from './dto/vet-worker-data.dto';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { RecordType } from '../records/schemas/record.schema';
import { UserRole } from '../users/schemas/user.schema';
import { MedicineRecord } from '../records/schemas/medicine-record.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(DailyLog.name) private readonly dailyLogModel: Model<DailyLog>,
    private readonly recordsService: RecordsService,
    private readonly pensService: PensService,
  ) {}

  /**
   * Get combined vet and worker data for the farmer dashboard
   * @param userId The ID of the user requesting the data
   * @param userRole The role of the user requesting the data
   * @returns Combined vet and worker data
   */
  async getVetWorkerData(userId: string, userRole: UserRole): Promise<VetWorkerDataDto> {
    // Get recent treatments (medicine records)
    const treatments = await this.recordsService.findAll(
      userId,
      userRole,
      RecordType.MEDICINE,
    ) as unknown as MedicineRecord[];

    // Get recent daily logs
    const dailyLogs = await this.getDailyLogs(userId, userRole);

    // Return combined data
    return {
      treatments,
      dailyLogs,
    };
  }

  /**
   * Get recent daily logs
   * @param userId The ID of the user requesting the data
   * @param userRole The role of the user requesting the data
   * @returns Array of daily logs with pen information
   */
  private async getDailyLogs(userId: string, userRole: UserRole): Promise<any[]> {
    // Build query based on user role
    const query: any = userRole === UserRole.FARMER ? {} : { owner: userId };

    // Get recent daily logs
    const logs = await this.dailyLogModel
      .find(query)
      .sort({ date: -1 })
      .limit(10)
      .populate('pen', 'name')
      .exec();

    // Transform logs to include pen name
    return logs.map(log => {
      const logObj = log.toObject();
      return {
        _id: logObj._id.toString(),
        date: logObj.date,
        penId: logObj.pen._id.toString(),
        penName: logObj.pen.name,
        eggsCollected: logObj.eggsCollected,
        poultryDeaths: logObj.poultryDeaths,
        poultrySold: logObj.poultrySold,
        salesAmount: logObj.salesAmount,
      };
    });
  }

  /**
   * Create a new daily log
   * @param createDailyLogDto The daily log data
   * @param userId The ID of the user creating the log
   * @returns The created daily log
   */
  async createDailyLog(createDailyLogDto: CreateDailyLogDto, userId: string): Promise<DailyLog> {
    // Verify the pen exists
    await this.pensService.findOne(createDailyLogDto.penId, userId, UserRole.WORKER);

    // Create new daily log
    const newLog = new this.dailyLogModel({
      date: createDailyLogDto.date,
      pen: createDailyLogDto.penId,
      eggsCollected: createDailyLogDto.eggsCollected,
      poultryDeaths: createDailyLogDto.poultryDeaths,
      poultrySold: createDailyLogDto.poultrySold || 0,
      salesAmount: createDailyLogDto.salesAmount || 0,
      owner: userId,
    });

    return newLog.save();
  }

  /**
   * Get daily logs for a specific user
   * @param userId The ID of the user
   * @returns Array of daily logs
   */
  async getUserDailyLogs(userId: string): Promise<DailyLog[]> {
    return this.dailyLogModel
      .find({ owner: userId })
      .sort({ date: -1 })
      .populate('pen', 'name')
      .exec();
  }
}
