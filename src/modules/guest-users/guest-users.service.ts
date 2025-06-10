import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestUser } from './entities/guest-user.entity';
import { CreateGuestUserDto } from './dto/create-guest-user.dto';

@Injectable()
export class GuestUsersService {
  constructor(
    @InjectRepository(GuestUser)
    private readonly guestUserRepo: Repository<GuestUser>,
  ) {}

  async create(createGuestUserDto: CreateGuestUserDto): Promise<GuestUser> {
    const guestUser = this.guestUserRepo.create(createGuestUserDto);
    return await this.guestUserRepo.save(guestUser);
  }

  async findAll(): Promise<GuestUser[]> {
    return await this.guestUserRepo.find({ relations: ['inquiries'] });
  }

  async findOne(id: number): Promise<GuestUser> {
    const guestUser = await this.guestUserRepo.findOne({
      where: { id },
      relations: ['inquiries'],
    });

    if (!guestUser) {
      throw new NotFoundException(`Guest user with ID ${id} not found`);
    }

    return guestUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.guestUserRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Guest user with ID ${id} not found`);
    }
  }
}
