import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Logger } from 'src/common/utils/logger';
// import { generatePassword } from 'src/common/utils/generatepassword';
import { EmailService } from 'src/common/utils/email/email.service';
import { PasswordGenerator } from 'src/common/utils/generatepassword';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly passwordGenerator: PasswordGenerator, // Assuming PasswordGenerator is a service that generates passwords
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    const password = await this.passwordGenerator.generate(12); 
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Error hashing password');
    }
    Logger.info(`Creating user with email: ${createUserDto.email}`);
    Logger.debug(`Hashed password: ${hashedPassword}`);
    Logger.debug(`User data: ${JSON.stringify(createUserDto)}`);
    createUserDto.password= hashedPassword;
    const newUser = this.userRepository.create(createUserDto);

    try {
      const savedUser = await this.userRepository.save(newUser);

      await this.emailService.sendWelcomeEmail(savedUser.email, password);

      Logger.info(`User with ID ${savedUser.id} created successfully`);
      return savedUser;
    } catch (error) {
      Logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  async findAll(page = 1, limit = 1000) {
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

  async findOne(id: number) {
    if (!id || isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      throw new BadRequestException('Invalid user ID provided');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['bookings', 'inquiries', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Logger.info(`User with ID ${id} fetched successfully`);
    return {
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ success: boolean; data: User; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = Object.assign(user, updateUserDto);
    if (updateUserDto.password) {
      updatedUser.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const saved = await this.userRepository.save(updatedUser);
    Logger.info(`User with ID ${id} updated successfully`);
    return {
      success: true,
      data: saved,
      message: 'User updated successfully',
    };
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Logger.info(`User with ID ${id} deleted successfully`);
    return {
      success: true,
      message: `User with ID ${id} deleted successfully`,
    };
  }
}
