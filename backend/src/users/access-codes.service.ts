import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessCode, CodeType } from './schemas/access-code.schema';
import { GenerateCodeDto, CodeResponseDto } from './dto/generate-code.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AccessCodesService {
  constructor(
    @InjectModel(AccessCode.name) private readonly accessCodeModel: Model<AccessCode>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async generateCode(userId: string, generateCodeDto: GenerateCodeDto): Promise<CodeResponseDto> {
    // Check if user exists and is a farmer
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Generate a random 6-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Determine code type
    let codeType: CodeType;
    if (generateCodeDto.isVet) {
      codeType = CodeType.VET;
    } else if (generateCodeDto.isWorker) {
      codeType = CodeType.WORKER;
    } else {
      throw new BadRequestException('Must specify either isVet or isWorker as true');
    }

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create new access code
    const newCode = new this.accessCodeModel({
      code,
      type: codeType,
      name: generateCodeDto.name,
      generatedBy: userId,
      expiresAt,
    });

    await newCode.save();

    return {
      code: newCode.code,
      type: newCode.type,
      name: newCode.name,
      expiresAt: newCode.expiresAt,
    };
  }

  async validateCode(code: string): Promise<AccessCode> {
    const accessCode = await this.accessCodeModel.findOne({ code, used: false }).exec();
    
    if (!accessCode) {
      throw new NotFoundException('Invalid or already used access code');
    }

    // Check if code is expired
    if (accessCode.expiresAt < new Date()) {
      throw new BadRequestException('Access code has expired');
    }

    return accessCode;
  }

  async useCode(code: string, userId: string): Promise<void> {
    const accessCode = await this.validateCode(code);
    
    // Mark code as used
    accessCode.used = true;
    accessCode.usedBy = userId;
    accessCode.usedAt = new Date();
    await accessCode.save();

    // Update user with appropriate access
    const updateData: any = { registeredBy: accessCode.generatedBy };
    
    if (accessCode.type === CodeType.VET) {
      updateData.isVet = true;
    } else if (accessCode.type === CodeType.WORKER) {
      updateData.isWorker = true;
    }

    await this.userModel.findByIdAndUpdate(userId, updateData).exec();
  }

  async getCodesByUser(userId: string): Promise<AccessCode[]> {
    return this.accessCodeModel.find({ generatedBy: userId }).sort({ createdAt: -1 }).exec();
  }
}