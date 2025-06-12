import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TourPackage } from './entities/tour-package.entity';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';
import { Review } from '../review/entities/review.entity';
import { PasswordGenerator } from 'src/common/utils/generatepassword';
import { PaginationResult, paginate } from 'src/common/pipes/pagination.util';

@Injectable()
export class TourPackagesService {
  constructor(
    @InjectRepository(TourPackage)
    private readonly tourPackageRepo: Repository<TourPackage>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async create(dto: CreateTourPackageDto): Promise<TourPackage> {
    const packageEntity = this.tourPackageRepo.create(dto);
    return this.tourPackageRepo.save(packageEntity);
  }

  async findAll(
    page = 1,
    limit = 1000,
  ): Promise<PaginationResult<TourPackage>> {
    const [data, total] = await this.tourPackageRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['bookings', 'tickets', 'inquiries', 'reviews'],
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: number): Promise<TourPackage> {
    const tour = await this.tourPackageRepo.findOne({
      where: { id },
      relations: ['bookings', 'tickets', 'inquiries', 'reviews'],
    });
    if (!tour) throw new NotFoundException('Tour package not found');
    return tour;
  }

  async update(id: number, dto: UpdateTourPackageDto): Promise<TourPackage> {
    const tour = await this.findOne(id);
    const updated = Object.assign(tour, dto);
    return this.tourPackageRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const tour = await this.findOne(id);
    await this.tourPackageRepo.remove(tour);
  }

  async getBookings(id: number): Promise<Booking[]> {
    return this.bookingRepo.find({ where: { tourPackage: { id } } });
  }

  async getTickets(id: number): Promise<Ticket[]> {
    return this.ticketRepo.find({ where: { tourPackage: { id } } });
  }

  async getInquiries(id: number): Promise<Inquiry[]> {
    return this.inquiryRepo.find({ where: { tourPackage: { id } } });
  }

  async getReviews(id: number): Promise<Review[]> {
    return this.reviewRepo.find({ where: { tourPackage: { id } } });
  }
}
