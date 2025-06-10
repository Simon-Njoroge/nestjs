import { Entity, PrimaryGeneratedColumn, ManyToOne, Column,JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TourPackage, tour => tour.reviews)
  @JoinColumn({ name: 'tourPackageId' })
  tourPackage: TourPackage;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
