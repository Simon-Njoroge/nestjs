import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const booking = await this.bookingRepository.findOne({
      where: { id: createPaymentDto.bookingId },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      booking,
    });

    return this.paymentRepository.save(payment);
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

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) throw new NotFoundException('Payment not found');

    if (updatePaymentDto.bookingId) {
      const booking = await this.bookingRepository.findOne({ where: { id: updatePaymentDto.bookingId } });
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
