import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { DatabaseModule } from 'src/config/database.module';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { Booking } from '../bookings/entities/booking.entity';
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Ticket, TourPackage, Booking]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
