import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { AccessCode, AccessCodeSchema } from './schemas/access-code.schema';
import { AccessCodesService } from './access-codes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AccessCode.name, schema: AccessCodeSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AccessCodesService],
  exports: [UsersService, AccessCodesService],
})
export class UsersModule {}
