import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository
      .save(createUserDto)
      .then((profile) => {
        return profile;
      })
      .catch((error) => {
        throw new Error('Profile creation failed');
      });
  }

async findAll(page = 1, limit = 1000): Promise<{ success: boolean; data: User[]; pagination: { total: number; page: number; limit: number; totalPages: number }; timestamp: string }> {
  const take = Math.min(limit, 10000); 
  const skip = (page - 1) * take;

  const [users, total] = await this.userRepository.findAndCount({
    skip,
    take,
    order: { id: 'ASC' }, 
  });

  return {
    success: true,
    data: users,
    pagination: {
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
    timestamp: new Date().toISOString(),
  };
}

async findOne(id: number): Promise<{ success: boolean; data: User; timestamp: string }> {
  if (!id || isNaN(id)) {
    throw new Error('Invalid user ID provided');
  }
  if (id <= 0) {
    throw new Error('User ID must be a positive integer');
  }
  if (!Number.isInteger(id)) {
    throw new Error('User ID must be an integer');
  }
  if (id > Number.MAX_SAFE_INTEGER) {
    throw new Error('User ID exceeds maximum safe integer value');
  }

  try {
    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return {
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Error fetching user with ID ${id}: ${error.message}`);
  }
}

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
