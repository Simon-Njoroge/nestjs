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
import { GuestUser } from '../../guest-users/entities/guest-user.entity';
@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isResolved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.inquiries, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: User;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.inquiries, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  tourPackage: TourPackage;

  @ManyToOne(() => GuestUser, (guestUser) => guestUser.inquiries, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  guestUser: GuestUser;
}
