import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../users/entities/user.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Inquiry } from '../inquiries/entities/inquiry.entity';
import { Review } from '../review/entities/review.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Role } from '../../common/constants';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly BATCH_SIZE = 500;
  private readonly TOTAL_RECORDS = 1_000_000;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(TourPackage)
    private readonly packageRepo: Repository<TourPackage>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
  ) {}

  async seed(): Promise<void> {
    await this.seedUsers();
    await this.seedTourPackages();
    await this.seedBookings();
    await this.seedPayments();
    await this.seedInquiries();
    await this.seedReviews();
    await this.seedTickets();
    this.logger.log('✅ Seeding completed successfully.');
  }

  private async seedUsers() {
    this.logger.log('🔄 Starting to seed users...');
    let userIndex = 1;

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const users = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = this.userRepo.create({
          email: `user${userIndex}@example.com`,
          password: faker.internet.password(),
          fullName: faker.person.fullName(),
          role: faker.helpers.arrayElement(Object.values(Role)),
          phone: faker.phone.number(),
          profilePicture: faker.image.avatar(),
          refreshToken: faker.string.uuid(),
          claims: [faker.lorem.word(), faker.lorem.word()],
        });
        userIndex++;
        return user;
      });

      try {
        await this.userRepo.save(users);
        this.logger.log(
          `✅ Saved batch ${i / this.BATCH_SIZE + 1} (${userIndex - 1} users total)`,
        );
      } catch (err) {
        this.logger.error(
          `❌ Failed to save batch ${i / this.BATCH_SIZE + 1}`,
          err,
        );
      }

      await new Promise((res) => setTimeout(res, 100)); // Optional delay to avoid DB overload
    }

    this.logger.log('🎉 Finished seeding all users!');
  }

  private async seedTourPackages() {
    this.logger.log('🔄 Seeding tour packages...');
    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const packages = Array.from({ length: this.BATCH_SIZE }, () =>
        this.packageRepo.create({
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraph(),
          location: faker.location.city(),
          price: +faker.commerce.price({ min: 100, max: 10000 }),
          durationDays: faker.number.int({ min: 1, max: 14 }),
          imageUrl: faker.image.url(),
        }),
      );
      await this.packageRepo.save(packages);
      this.logger.log(`Tour packages batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }

  private async seedBookings() {
    this.logger.log('🔄 Seeding bookings...');
    const userIds = await this.userRepo.find({ select: ['id'] });
    const packageIds = await this.packageRepo.find({ select: ['id'] });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const bookings = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = faker.helpers.arrayElement(userIds);
        const tourPackage = faker.helpers.arrayElement(packageIds);

        return this.bookingRepo.create({
          bookingDate: faker.date.future().toISOString(),
          numberOfPeople: faker.number.int({ min: 1, max: 10 }),
          status: faker.helpers.arrayElement([
            'pending',
            'confirmed',
            'cancelled',
          ]),
          notes: faker.lorem.sentence(),
          user: { id: user.id },
          tourPackage: { id: tourPackage.id },
        });
      });

      await this.bookingRepo.save(bookings);
      this.logger.log(`Bookings batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }

  private async seedPayments() {
    this.logger.log('🔄 Seeding payments...');
    const bookingIds = await this.bookingRepo.find({ select: ['id'] });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const payments = Array.from({ length: this.BATCH_SIZE }, () => {
        const booking = faker.helpers.arrayElement(bookingIds);
        return this.paymentRepo.create({
          booking: { id: booking.id },
          transactionId: faker.string.uuid(),
          amount: faker.number.float({
            min: 100,
            max: 10000,
            fractionDigits: 2,
          }),
          phone: faker.phone.number(),
          paidAt: faker.date.recent(),
          method: 'mpesa',
          status: faker.helpers.arrayElement(['success', 'failed', 'pending']),
        });
      });
      await this.paymentRepo.save(payments);
      this.logger.log(`Payments batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }

  private async seedInquiries() {
    this.logger.log('🔄 Seeding inquiries...');
    const userIds = await this.userRepo.find({ select: ['id'] });
    const packageIds = await this.packageRepo.find({ select: ['id'] });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const inquiries = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = faker.helpers.arrayElement(userIds);
        const tourPackage = faker.helpers.arrayElement(packageIds);
        return this.inquiryRepo.create({
          user: { id: user.id },
          tourPackage: { id: tourPackage.id },
          message: faker.lorem.sentence(),
          submittedAt: faker.date.recent(),
        });
      });
      await this.inquiryRepo.save(inquiries);
      this.logger.log(`Inquiries batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }

  private async seedReviews() {
    this.logger.log('🔄 Seeding reviews...');
    const userIds = await this.userRepo.find({ select: ['id'] });
    const packageIds = await this.packageRepo.find({ select: ['id'] });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const reviews = Array.from({ length: this.BATCH_SIZE }, () => {
        const user = faker.helpers.arrayElement(userIds);
        const tourPackage = faker.helpers.arrayElement(packageIds);
        return this.reviewRepo.create({
          user: { id: user.id },
          tourPackage: { id: tourPackage.id },
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentences(2),
        });
      });
      await this.reviewRepo.save(reviews);
      this.logger.log(`Reviews batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }

  private async seedTickets() {
    this.logger.log('🔄 Seeding tickets...');
    const bookingIds = await this.bookingRepo.find({ select: ['id'] });
    const packageIds = await this.packageRepo.find({ select: ['id'] });

    for (let i = 0; i < this.TOTAL_RECORDS; i += this.BATCH_SIZE) {
      const tickets = Array.from({ length: this.BATCH_SIZE }, () => {
        const booking = faker.helpers.arrayElement(bookingIds);
        const tourPackage = faker.helpers.arrayElement(packageIds);
        return this.ticketRepo.create({
          booking: { id: booking.id },
          tourPackage: { id: tourPackage.id },
          travelerName: faker.person.fullName(),
          travelerEmail: faker.internet.email(),
          travelerPhone: faker.phone.number(),
        });
      });
      await this.ticketRepo.save(tickets);
      this.logger.log(`Tickets batch ${i / this.BATCH_SIZE + 1} saved`);
    }
  }
}
