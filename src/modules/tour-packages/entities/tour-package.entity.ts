import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Inquiry } from '../../inquiries/entities/inquiry.entity';
import { Booking } from '../../bookings/entities/booking.entity';
// const uuidv4 = require('uuid').v4; 
@Entity()
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  destination: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.tourPackages, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.tourPackage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.tourPackage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  inquiries: Inquiry[];

  @OneToMany(() => Booking, (booking) => booking.tourPackage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bookings: Booking[];

  // @BeforeInsert()
  // generateId() {
  //   this.id = uuidv4();
  // }
}
