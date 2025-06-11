import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { DatabaseModule } from 'src/config/database.module';
import { MpesaModule } from 'src/common/utils/payment/mpesa.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Payment, Booking]),MpesaModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
