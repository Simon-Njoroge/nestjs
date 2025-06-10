import { Module } from '@nestjs/common';
import { TourPackagesService } from './tour-packages.service';
import { TourPackagesController } from './tour-packages.controller';
import { Booking } from '../bookings/entities/booking.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';
import { Review } from '../review/entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Ticket, Inquiry, Review]),
    DatabaseModule,
  ],
  controllers: [TourPackagesController],
  providers: [TourPackagesService],
})
export class TourPackagesModule {}
