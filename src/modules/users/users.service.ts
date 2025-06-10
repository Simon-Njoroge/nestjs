import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Logger } from 'src/common/utils/logger';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error(`User with email ${createUserDto.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);
      Logger.info(`User with ID ${savedUser.id} created successfully`);
      return savedUser;
    } catch (error) {
      Logger.error(`Error creating user: ${error.message}`);
      throw new Error(`Error creating user: ${error.message}`);
    }
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
      where: { id },
      relations: ['bookings', 'inquiries', 'reviews'],
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return {
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    };
    Logger.info(`User with ID ${id} fetched successfully`);
  } catch (error) {
    throw new Error(`Error fetching user with ID ${id}: ${error.message}`);
  }
}

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return this.userRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new Error(`User with ID ${id} not found`);
      }
      Logger.info(`User with ID ${id} deleted successfully`);
      return { success: true, message: `User with ID ${id} deleted successfully` };
    }).catch((error) => {
      Logger.error(`Error deleting user with ID ${id}: ${error.message}`);
      throw new Error(`Error deleting user with ID ${id}: ${error.message}`);
    });
  }
}
