import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { User } from '../users/entities/user.entity';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Review, User, TourPackage]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
