import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { TourPackage } from '../tour-packages/entities/tour-package.entity';
import { User } from '../users/entities/user.entity';
import { GuestUser } from '../guest-users/entities/guest-user.entity';
import { PaginationResult, paginate } from 'src/common/pipes/pagination.util';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,

    @InjectRepository(TourPackage)
    private readonly tourPackageRepo: Repository<TourPackage>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(GuestUser)
    private readonly guestUserRepo: Repository<GuestUser>,
  ) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const tour = await this.tourPackageRepo.findOne({
      where: { id: createInquiryDto.tourPackageId },
    });
    if (!tour) throw new NotFoundException('Tour package not found');

    const inquiry = new Inquiry();
    inquiry.tourPackage = tour;
    inquiry.message = createInquiryDto.message;
    inquiry.submittedAt = createInquiryDto.submittedAt;

    if (createInquiryDto.userId) {
      const user = await this.userRepo.findOne({
        where: { id: createInquiryDto.userId },
      });
      if (!user) throw new NotFoundException('User not found');
      inquiry.user = user;
    } else if (createInquiryDto.guestUserId) {
      const guest = await this.guestUserRepo.findOne({
        where: { id: createInquiryDto.guestUserId },
      });
      if (!guest) throw new NotFoundException('Guest user not found');
      inquiry.guestUser = guest;
    }

    return this.inquiryRepo.save(inquiry);
  }

  async findAll(page = 1, limit = 1000): Promise<PaginationResult<Inquiry>> {
    const [data, total] = await this.inquiryRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['tourPackage', 'user', 'guestUser'],
      order: { submittedAt: 'DESC' },
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: number): Promise<Inquiry> {
    const inquiry = await this.inquiryRepo.findOne({
      where: { id },
      relations: ['tourPackage', 'user', 'guestUser'],
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async remove(id: number): Promise<void> {
    const inquiry = await this.findOne(id);
    await this.inquiryRepo.remove(inquiry);
  }
}
