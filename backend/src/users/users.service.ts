import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingEmail = await this.userModel.findOne({ email: createUserDto.email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.userModel.findOne({ username: createUserDto.username });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const userObject = savedUser.toObject();

    // Create a new object with the correct types
    const typedUserObject = {
      ...userObject,
      _id: userObject._id.toString(), // Explicitly convert _id from unknown to string
    };

    return new UserResponseDto(typedUserObject);
  }

  async findAll(userId: string): Promise<UserResponseDto[]> {
    // Find users who were registered by the current user (team members)
    const users = await this.userModel.find({ registeredBy: userId }).exec();
    return users.map(user => {
      const userObject = user.toObject();

      // Create a new object with the correct types
      const typedUserObject = {
        ...userObject,
        _id: userObject._id.toString(), // Explicitly convert _id from unknown to string
      };

      return new UserResponseDto(typedUserObject);
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const userObject = user.toObject();

    // Create a new object with the correct types
    const typedUserObject = {
      ...userObject,
      _id: userObject._id.toString(), // Explicitly convert _id from unknown to string
    };

    return new UserResponseDto(typedUserObject);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Check if email is being updated and already exists
    if (updateUserDto.email) {
      const existingEmail = await this.userModel.findOne({ 
        email: updateUserDto.email,
        _id: { $ne: id }
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if username is being updated and already exists
    if (updateUserDto.username) {
      const existingUsername = await this.userModel.findOne({ 
        username: updateUserDto.username,
        _id: { $ne: id }
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const userObject = updatedUser.toObject();

    // Create a new object with the correct types
    const typedUserObject = {
      ...userObject,
      _id: userObject._id.toString(), // Explicitly convert _id from unknown to string
    };

    return new UserResponseDto(typedUserObject);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    const result = await this.userModel.updateOne(
      { _id: id },
      { lastLogin: new Date() }
    ).exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
