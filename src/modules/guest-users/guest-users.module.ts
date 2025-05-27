import { Module } from '@nestjs/common';
import { GuestUsersService } from './guest-users.service';
import { GuestUsersController } from './guest-users.controller';

@Module({
  controllers: [GuestUsersController],
  providers: [GuestUsersService],
})
export class GuestUsersModule {}
