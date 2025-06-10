import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(TourPackage)
    private readonly tourPackageRepo: Repository<TourPackage>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async create(createDto: CreateTicketDto): Promise<Ticket> {
    const tourPackage = await this.tourPackageRepo.findOne({
      where: { id: createDto.tourPackageId },
    });
    if (!tourPackage) {
      throw new NotFoundException('Tour Package not found');
    }

    const booking = await this.bookingRepo.findOne({
      where: { id: createDto.bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const ticket = this.ticketRepo.create({
      travelerName: createDto.travelerName,
      travelerEmail: createDto.travelerEmail,
      travelerPhone: createDto.travelerPhone,
      booking,
      tourPackage,
    });

    return await this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepo.find({
      relations: ['tourPackage', 'booking'],
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['tourPackage', 'booking'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(id: number, updateDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (updateDto.tourPackageId) {
      const tour = await this.tourPackageRepo.findOne({
        where: { id: updateDto.tourPackageId },
      });
      if (!tour) throw new BadRequestException('Invalid Tour Package');
      ticket.tourPackage = tour;
    }

    if (updateDto.bookingId) {
      const booking = await this.bookingRepo.findOne({
        where: { id: updateDto.bookingId },
      });
      if (!booking) throw new BadRequestException('Invalid Booking');
      ticket.booking = booking;
    }

    Object.assign(ticket, updateDto);
    return await this.ticketRepo.save(ticket);
  }

  async remove(id: number): Promise<void> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.ticketRepo.remove(ticket);
  }
}
