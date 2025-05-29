import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';
import { Booking } from 'src/modules/bookings/entities/booking.entity';
@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  seatNumber: string;

  @Column({ default: false })
  isUsed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.tickets, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: User;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.tickets, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  tourPackage: TourPackage;

  bookings: Booking[];
}
