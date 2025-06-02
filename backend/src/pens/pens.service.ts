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

  async findAll(userId: string, userRole: UserRole): Promise<Pen[]> {
    // If user is a farmer, return only their pens
    // If user is a worker or vet, return all pens
    const query = userRole === UserRole.FARMER ? { owner: userId } : {};
    return this.penModel.find(query).exec();
  }

  async findOne(id: string, userId: string, userRole: UserRole): Promise<Pen> {
    const pen = await this.penModel.findById(id).exec();
    
    if (!pen) {
      throw new NotFoundException(`Pen with ID ${id} not found`);
    }
    
    // Check if user has access to this pen
    if (userRole === UserRole.FARMER && pen.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this pen');
    }
    
    return pen;
  }

  async update(id: string, updatePenDto: UpdatePenDto, userId: string, userRole: UserRole): Promise<Pen> {
    const pen = await this.findOne(id, userId, userRole);
    
    // Only allow updates to pens owned by the user if they are a farmer
    if (userRole === UserRole.FARMER && pen.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this pen');
    }
    
    return this.penModel.findByIdAndUpdate(
      id,
      updatePenDto,
      { new: true }
    ).exec();
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const pen = await this.findOne(id, userId, userRole);
    
    // Only allow deletion of pens owned by the user if they are a farmer
    if (userRole === UserRole.FARMER && pen.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this pen');
    }
    
    await this.penModel.findByIdAndDelete(id).exec();
  }

  async getPenStats(userId: string, userRole: UserRole): Promise<any> {
    const query = userRole === UserRole.FARMER ? { owner: userId } : {};
    
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