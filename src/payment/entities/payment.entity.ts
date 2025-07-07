import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  transactionId: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  phone: string;

  @Column({ type: 'timestamp' })
  paidAt: Date;

  @Column()
  method: string;

  @Column({ default: 'success' })
  status: 'success' | 'failed' | 'pending';
}
