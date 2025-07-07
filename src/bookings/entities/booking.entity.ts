import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Payment } from '../../payment/entities/payment.entity';
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TourPackage, (tour) => tour.bookings)
  @JoinColumn({ name: 'tourPackageId' })
  tourPackage: TourPackage;

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];

  @OneToOne(() => Payment, (payment) => payment.booking, { cascade: true })
  payment: Payment;

  @Column({ type: 'timestamp' })
  bookingDate: Date;

  @Column({ type: 'int' })
  numberOfPeople: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({ nullable: true })
  notes?: string;
}
