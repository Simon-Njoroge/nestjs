import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../users/entities/user.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(TourPackage)
    private readonly tourPackageRepo: Repository<TourPackage>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const tour = await this.tourPackageRepo.findOne({
      where: { id: dto.tourPackageId },
    });
    if (!tour) throw new NotFoundException('Tour package not found');

    const review = this.reviewRepo.create({
      ...dto,
      user,
      tourPackage: tour,
      createdAt: new Date(),
    });

    return this.reviewRepo.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepo.find({
      relations: ['user', 'tourPackage'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'tourPackage'],
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    Object.assign(review, dto);
    return this.reviewRepo.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepo.remove(review);
  }
}
