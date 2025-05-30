import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';
const { faker } = require('@faker-js/faker');
import { Role } from '../../common/constants';

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
    // @InjectRepository(Ticket)
    // private readonly ticketRepository: Repository<Ticket>,
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
      await this.dataSource.transaction(async (manager) => {
        await manager.query(`
  TRUNCATE TABLE "booking", "inquiry", "tour_package", "user" RESTART IDENTITY CASCADE;
`);
      });
      this.logger.log('Existing data cleared');

      // Seed users
      this.logger.log('Seeding 200,000 users...');
      const BATCH_SIZE = 1000;
      const TOTAL_USERS = 200000;

      for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
        const batch: User[] = [];

        for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_USERS; j++) {
          const index = i + j;

          const user = new User();
          user.email = `user${index}@example.com`;
          user.password = faker.internet.password();
          user.firstName = faker.person.firstName();
          user.lastName = faker.person.lastName();
          user.role = faker.helpers.arrayElement([
            'admin',
            'user',
            'guest',
          ]) as Role;
          user.phoneNumber = `07123${String(10000 + index).slice(-5)}`;
          user.profilePicture = faker.image.avatar();

          batch.push(user);
        }

        await this.userRepository.save(batch);
        this.logger.log(`Saved ${i + batch.length} users...`);
      }

      this.logger.log('✅ 100,000 users seeded successfully.');

      // //seed tour packages
      // this.logger.log('Seeding tour packages...');
      // const BATCH_SIZE_TOUR = 1000;
      // const TOTAL_TOUR_PACKAGES = 100000;
      // for (let i = 0; i < TOTAL_TOUR_PACKAGES; i += BATCH_SIZE_TOUR) {
      //   const batchtourpackage: TourPackage[] = [];
      //   for (
      //     let j = 0;
      //     j < BATCH_SIZE_TOUR && i + j < TOTAL_TOUR_PACKAGES;
      //     j++
      //   ) {
      //     const tour = new TourPackage();
      //     tour.title = faker.commerce.productName();
      //     tour.description = faker.lorem.paragraph();
      //     tour.price = parseFloat(faker.commerce.price());
      //     tour.startDate = faker.date.future();
      //     tour.endDate = faker.date.future();
      //     batchtourpackage;
      //   }
      //   await this.tourPackageRepository.save(batchtourpackage);
      //   this.logger.log(
      //     `Saved ${i + batchtourpackage.length} tour packages...`,
      //   );
      // }

      //seed
      return {
        message:
          'Database seeded successfully with 50,000 users and tourpackage.',
      };
    } catch (error) {
      this.logger.error('❌ Error during seeding:', error);
      throw new Error('Seeding failed');
    }
  }
}
