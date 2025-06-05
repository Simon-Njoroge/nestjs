import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TourPackage, Booking, Inquiry, Ticket]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
