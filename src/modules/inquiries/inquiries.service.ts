import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './entities/inquiry.entity';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepo: Repository<Inquiry>,
  ) {}

  async findAll(): Promise<Inquiry[]> {
    try {
      return await this.inquiryRepo.find({ relations: ['user', 'tourPackage', 'guestUser'] });
    } catch (error) {
      this.logger.error('Failed to fetch inquiries', error.stack);
      throw new InternalServerErrorException('Failed to fetch inquiries');
    }
  }

  async findOne(id: string): Promise<Inquiry> {
    try {
      const inquiry = await this.inquiryRepo.findOne({ where: { id }, relations: ['user', 'tourPackage', 'guestUser'] });
      if (!inquiry) throw new NotFoundException('Inquiry not found');
      return inquiry;
    } catch (error) {
      this.logger.error(`Failed to fetch inquiry with id ${id}`, error.stack);
      throw error;
    }
  }

  async create(data: Partial<Inquiry>): Promise<Inquiry> {
    try {
      const inquiry = this.inquiryRepo.create(data);
      return await this.inquiryRepo.save(inquiry);
    } catch (error) {
      this.logger.error('Failed to create inquiry', error.stack);
      throw new InternalServerErrorException('Failed to create inquiry');
    }
  }

  async update(id: string, data: Partial<Inquiry>): Promise<Inquiry> {
    try {
      await this.inquiryRepo.update(id, data);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to update inquiry ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update inquiry');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.inquiryRepo.softDelete(id);
    } catch (error) {
      this.logger.error(`Failed to delete inquiry ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete inquiry');
    }
  }
}
