import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pen } from './schemas/pen.schema';
import { CreatePenDto } from './dto/create-pen.dto';
import { UpdatePenDto } from './dto/update-pen.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class PensService {
  constructor(
    @InjectModel(Pen.name) private readonly penModel: Model<Pen>,
  ) {}

  async create(createPenDto: CreatePenDto, userId: string): Promise<Pen> {
    const newPen = new this.penModel({
      ...createPenDto,
      owner: userId,
    });
    return newPen.save();
  }

  async findAll(userId: string, userRole: UserRole, isWorker: boolean = false, isVet: boolean = false, registeredBy?: string): Promise<Pen[]> {
    // If user is a farmer (and not a worker or vet), return only their pens
    // If user is a worker or vet, return pens owned by the farmer who registered them
    let query = {};

    if (!isWorker && !isVet) {
      // Farmer sees their own pens
      query = { owner: userId };
    } else if (registeredBy) {
      // Worker or vet sees pens owned by the farmer who registered them
      query = { owner: registeredBy };
    }

    return this.penModel.find(query).exec();
  }

  async findOne(id: string, userId: string, userRole: UserRole, isWorker: boolean = false, isVet: boolean = false, registeredBy?: string): Promise<Pen> {
    const pen = await this.penModel.findById(id).exec();

    if (!pen) {
      throw new NotFoundException(`Pen with ID ${id} not found`);
    }

    // Check if user has access to this pen
    // Farmers can only access their own pens
    // Workers and vets can only access pens owned by the farmer who registered them
    if (!isWorker && !isVet) {
      // Farmer access check
      if (pen.owner.toString() !== userId) {
        throw new ForbiddenException('You do not have access to this pen');
      }
    } else if (registeredBy) {
      // Worker or vet access check
      if (pen.owner.toString() !== registeredBy) {
        throw new ForbiddenException('You do not have access to this pen');
      }
    } else {
      // Worker or vet without registeredBy cannot access any pens
      throw new ForbiddenException('You do not have access to this pen');
    }

    return pen;
  }

  async update(id: string, updatePenDto: UpdatePenDto, userId: string, userRole: UserRole, isWorker: boolean = false, isVet: boolean = false, registeredBy?: string): Promise<Pen> {
    const pen = await this.findOne(id, userId, userRole, isWorker, isVet, registeredBy);

    // Only farmers can update pens, and only their own pens
    // Workers and vets cannot update pens, even if they are also farmers
    if (isWorker || isVet) {
      throw new ForbiddenException('Workers and veterinarians cannot update pens');
    }

    // Farmers can only update their own pens
    if (pen.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this pen');
    }

    return this.penModel.findByIdAndUpdate(
      id,
      updatePenDto,
      { new: true }
    ).exec();
  }

  async remove(id: string, userId: string, userRole: UserRole, isWorker: boolean = false, isVet: boolean = false, registeredBy?: string): Promise<void> {
    const pen = await this.findOne(id, userId, userRole, isWorker, isVet, registeredBy);

    // Only farmers can delete pens, and only their own pens
    // Workers and vets cannot delete pens, even if they are also farmers
    if (isWorker || isVet) {
      throw new ForbiddenException('Workers and veterinarians cannot delete pens');
    }

    // Farmers can only delete their own pens
    if (pen.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this pen');
    }

    await this.penModel.findByIdAndDelete(id).exec();
  }

  async getPenStats(userId: string, userRole: UserRole, isWorker: boolean = false, isVet: boolean = false, registeredBy?: string): Promise<any> {
    let query = {};

    if (!isWorker && !isVet) {
      // Farmer sees their own pens
      query = { owner: userId };
    } else if (registeredBy) {
      // Worker or vet sees pens owned by the farmer who registered them
      query = { owner: registeredBy };
    }

    const pens = await this.penModel.find(query).exec();

    const totalBirds = pens.reduce((sum, pen) => sum + pen.birdCount, 0);
    const totalEggs = pens.reduce((sum, pen) => sum + pen.dailyEggAvg, 0);
    const avgMortality = pens.length > 0 
      ? pens.reduce((sum, pen) => sum + pen.mortality, 0) / pens.length 
      : 0;

    return {
      totalPens: pens.length,
      totalBirds,
      totalEggs,
      avgMortality,
      pensByType: {
        layers: pens.filter(pen => pen.type === 'Layers').length,
        broilers: pens.filter(pen => pen.type === 'Broilers').length,
        chicks: pens.filter(pen => pen.type === 'Chicks').length,
      }
    };
  }
}
