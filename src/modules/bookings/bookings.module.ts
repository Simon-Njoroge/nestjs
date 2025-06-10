import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { DatabaseModule } from 'src/config/database.module';
import { User } from '../../modules/users/entities/user.entity';
import { TourPackage } from '../../modules/tour-packages/entities/tour-package.entity';


@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Booking, User, TourPackage]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
