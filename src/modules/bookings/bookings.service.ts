import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../../modules/users/entities/user.entity';
import { TourPackage } from '../../modules/tour-packages/entities/tour-package.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(TourPackage)
    private readonly tourRepo: Repository<TourPackage>,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const tour = await this.tourRepo.findOne({
      where: { id: dto.tourPackageId },
    });

    if (!user || !tour) {
      throw new BadRequestException('Invalid user or tour package');
    }

    const booking = this.bookingRepo.create({
      user,
      tourPackage: tour,
      bookingDate: new Date(dto.bookingDate),
      numberOfPeople: dto.numberOfPeople,
      status: dto.status || 'pending',
      notes: dto.notes,
    });

    return this.bookingRepo.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: ['user', 'tourPackage', 'tickets', 'payment'],
      order: { bookingDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'tourPackage', 'tickets', 'payment'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepo.remove(booking);
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'confirmed' | 'cancelled',
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = status;
    return this.bookingRepo.save(booking);
  }
}
