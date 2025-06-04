import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AccessCodesService } from '../users/access-codes.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly accessCodesService: AccessCodesService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    // Ensure role is set to FARMER for all registrations through auth service
    createUserDto.role = 'farmer' as any;

    // Extract vetCode and workerCode if present
    const { vetCode, workerCode, ...userData } = createUserDto as any;

    // Create the user first
    const user = await this.usersService.create(userData);

    // If a code was provided, validate and use it
    if (vetCode) {
      await this.accessCodesService.useCode(vetCode, user._id);
    }

    if (workerCode) {
      await this.accessCodesService.useCode(workerCode, user._id);
    }

    // Get the updated user with the correct roles
    const updatedUser = await this.usersService.findOne(user._id);

    // Generate token with the updated user info
    const token = this.generateToken(updatedUser);

    return new AuthResponseDto({
      accessToken: token,
      user: updatedUser,
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { emailOrUsername, password } = loginDto;

    // Try to find user by email or username
    let user = await this.usersService.findByEmail(emailOrUsername);
    if (!user) {
      user = await this.usersService.findByUsername(emailOrUsername);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.usersService.updateLastLogin(user._id.toString());

    // Generate token
    const token = this.generateToken(user);

    const userObject = user.toObject();

    // Create a new object with the correct types
    const typedUserObject = {
      ...userObject,
      _id: userObject._id.toString(), // Explicitly convert _id from unknown to string
    };

    return new AuthResponseDto({
      accessToken: token,
      user: new UserResponseDto(typedUserObject),
    });
  }

  private generateToken(user: any): string {
    const payload: JwtPayload = {
      // Explicitly convert _id from unknown to string
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      isWorker: user.isWorker || false,
      isVet: user.isVet || false,
      registeredBy: user.registeredBy || undefined,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
