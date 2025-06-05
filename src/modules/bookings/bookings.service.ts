import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async findAll(): Promise<Booking[]> {
    try {
      return await this.bookingRepo.find({ relations: ['user', 'guestUser', 'tourPackage'] });
    } catch (error) {
      this.logger.error('Failed to fetch bookings', error.stack);
      throw new InternalServerErrorException('Failed to fetch bookings');
    }
  }

  async findOne(id: string): Promise<Booking> {
    try {
      const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['user', 'guestUser', 'tourPackage'] });
      if (!booking) throw new NotFoundException('Booking not found');
      return booking;
    } catch (error) {
      this.logger.error(`Failed to fetch booking with id ${id}`, error.stack);
      throw error;
    }
  }

  async create(data: Partial<Booking>): Promise<Booking> {
    try {
      const booking = this.bookingRepo.create(data);
      return await this.bookingRepo.save(booking);
    } catch (error) {
      this.logger.error('Failed to create booking', error.stack);
      throw new InternalServerErrorException('Failed to create booking');
    }
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    try {
      await this.bookingRepo.update(id, data);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to update booking ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update booking');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.bookingRepo.softDelete(id);
    } catch (error) {
      this.logger.error(`Failed to delete booking ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete booking');
    }
  }
}

