import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { MpesaClient } from '../../common/utils/payment/mpesa-client'; // Adjust path if needed
import { Logger } from '../../common/utils/logger'; // Adjust path if needed

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, transactionId, amount,phone,method ,status,paidAt} = createPaymentDto;
    const booking = await this.bookingRepository.findOne({
      where: { id: createPaymentDto.bookingId },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    try {
      const reference = `BOOKING-${booking.id}-${Date.now()}`;
      const stkResult = await MpesaClient.stkPush(
        createPaymentDto.phone,
        createPaymentDto.amount,
        reference,
      );

      // Save payment record if MPESA was successful
      const payment = this.paymentRepository.create({
        transactionId: stkResult?.queryResult?.MpesaReceiptNumber || transactionId,
        amount: stkResult?.queryResult?.Amount || amount,
        phone: createPaymentDto.phone,
        paidAt: new Date(paidAt || Date.now()),
        method: method || 'mpesa',
        // booking,
        // status: 'SUCCESS',
        // transactionCode: stkResult?.queryResult?.MpesaReceiptNumber,
        // providerResponse: JSON.stringify(stkResult),
      });
      payment.booking = booking;
      payment.status = status || 'success'; // Default to 'success' if not provided

      Logger.log('Payment recorded successfully');
      return await this.paymentRepository.save(payment);
    } catch (err) {
      Logger.error('Payment failed', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['booking'] });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['booking'],
    });

    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) throw new NotFoundException('Payment not found');

    if (updatePaymentDto.bookingId) {
      const booking = await this.bookingRepository.findOne({
        where: { id: updatePaymentDto.bookingId },
      });
      if (!booking) throw new BadRequestException('Invalid bookingId');
      payment.booking = booking;
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Payment not found');
    }
  }
}
