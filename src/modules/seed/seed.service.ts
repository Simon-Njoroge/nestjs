import { Injectable,Logger } from '@nestjs/common';
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
      await this.dataSource.transaction(async (manager) => {
        await manager.query(`
        TRUNCATE TABLE 
        "ticket", "booking", "inquiry", "tour_package", "user" 
        RESTART IDENTITY CASCADE;
      `);
      });

      this.logger.log('Existing data cleared');

      // Seed users
      const TOTAL_USERS = 1000;
      const users: User[] = [];

      for (let i = 0; i < TOTAL_USERS; i++) {
        const user = this.userRepository.create({
          email: `user${i}@example.com`,
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: faker.helpers.arrayElement(['admin', 'user', 'guest']) as Role,
          phoneNumber: faker.phone.number('07########'),
          profilePicture: faker.image.avatar(),
        });
        users.push(user);
      }

      await this.userRepository.save(users);
      this.logger.log(`${TOTAL_USERS} users seeded`);

      // Seed tour packages
      const TOTAL_PACKAGES = 100;
      const tourPackages: TourPackage[] = [];

      for (let i = 0; i < TOTAL_PACKAGES; i++) {
        const pkg = this.tourPackageRepository.create({
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          price: faker.number.float({ min: 100, max: 5000 }),
          startDate: faker.date.future(),
          endDate: faker.date.future({ years: 1 }),
        });
        tourPackages.push(pkg);
      }

      await this.tourPackageRepository.save(tourPackages);
      this.logger.log(`${TOTAL_PACKAGES} tour packages seeded`);



      // Seed inquiries
      const inquiries: Inquiry[] = [];

      for (let i = 0; i < 300; i++) {
        const user = faker.helpers.arrayElement(users);
        const tour = faker.helpers.arrayElement(tourPackages);

        const inquiry = this.inquiryRepository.create({
          subject: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          isResolved: faker.datatype.boolean(),
          user,
          tourPackage: tour,
        });

        inquiries.push(inquiry);
      }

      await this.inquiryRepository.save(inquiries);
      this.logger.log(`300 inquiries seeded`);

      return { message: 'Database seeded successfully with related data.' };
    } catch (error) {
      this.logger.error('❌ Error during seeding:', error);
      throw new Error('Seeding failed');
    }
  }
}
