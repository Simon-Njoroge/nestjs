import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Inquiry } from '../../inquiries/entities/inquiry.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../../common/constants';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bookings: Booking[];

  @OneToMany(() => Ticket, (ticket) => ticket.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  inquiries: Inquiry[];

  @OneToMany(() => TourPackage, (tourPackage) => tourPackage.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tourPackages: TourPackage[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
