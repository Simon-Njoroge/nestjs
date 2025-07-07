import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { DatabaseModule } from 'src/config/database.module';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { User } from '../users/entities/user.entity';
import { GuestUser } from '../guest-users/entities/guest-user.entity';
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Inquiry, TourPackage, User, GuestUser]),
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
