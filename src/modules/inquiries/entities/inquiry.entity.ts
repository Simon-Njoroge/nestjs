import { Entity, PrimaryGeneratedColumn, ManyToOne, Column,JoinColumn } from 'typeorm';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';
import { User } from '../../users/entities/user.entity';
import { GuestUser } from '../../guest-users/entities/guest-user.entity';
import { join } from 'path';
@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TourPackage, tour => tour.inquiries)
  @JoinColumn({ name: 'tourPackageId' })
  tourPackage: TourPackage;

  @ManyToOne(() => User, user => user.inquiries, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => GuestUser, guest => guest.inquiries, { nullable: true })
  @JoinColumn({ name: 'guestUserId' })
  guestUser?: GuestUser;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'timestamp' })
  submittedAt: Date;
}
