import { Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { User } from '../users/entities/user.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TourPackage)
    private readonly tourPackageRepository: Repository<TourPackage>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('SeedService initialized');
  }

  async seed() {
    try {
      this.logger.log('Seeding the database...');

      // Clear existing data
      try {
        await this.dataSource.transaction(async (manager) => {
          await manager.clear(User);
          await manager.clear(TourPackage);
          await manager.clear(Booking);
          await manager.clear(Ticket);
          await manager.clear(Inquiry);
        });
        this.logger.log('Existing data cleared');
      } catch (error) {
        this.logger.error('Error clearing existing data:', error);
        throw new Error('Failed to clear existing data');
      }

      // Seed Users
      
    } catch (error) {
      this.logger.error('Error during seeding:', error);
      throw new Error('Seeding failed');
    }
    this.logger.log('Database seeded successfully');
    return { message: 'Database seeded successfully' };
  }
}
