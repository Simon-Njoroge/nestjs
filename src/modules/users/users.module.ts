import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/config/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailModule } from 'src/common/utils/email/email.module';
@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User]),EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
