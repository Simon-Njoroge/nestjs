import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TourPackage, (tour) => tour.tickets)
  @JoinColumn({ name: 'tourPackageId' })
  tourPackage: TourPackage;

  @ManyToOne(() => Booking, (booking) => booking.tickets)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  travelerName: string;

  @Column()
  travelerEmail: string;

  @Column()
  travelerPhone: string;
}
