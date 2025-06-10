import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Inquiry } from '../../inquiries/entities/inquiry.entity';
import { Review } from '../../review/entities/review.entity';
@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  durationDays: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => Booking, booking => booking.tourPackage)
  bookings: Booking[];

  @OneToMany(() => Ticket, ticket => ticket.tourPackage)
  tickets: Ticket[];

  @OneToMany(() => Inquiry, inquiry => inquiry.tourPackage)
  inquiries: Inquiry[];

  @OneToMany(() => Review, review => review.tourPackage)
  reviews: Review[];
}
