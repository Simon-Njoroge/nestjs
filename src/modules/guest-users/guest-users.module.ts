import { Module } from '@nestjs/common';
import { GuestUsersService } from './guest-users.service';
import { GuestUsersController } from './guest-users.controller';
import { GuestUser } from './entities/guest-user.entity';
import { DatabaseModule } from 'src/config/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([GuestUser])],
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}
