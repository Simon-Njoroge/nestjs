import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { DatabaseModule } from 'src/config/database.module';
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Inquiry]),
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
