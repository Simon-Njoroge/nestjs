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
import { Logger } from 'src/common/utils/logger';
import * as bcrypt from 'bcrypt'; 
// import { generatePassword } from 'src/common/utils/generatepassword';
import { EmailService } from 'src/common/utils/email/email.service';
import { PasswordGenerator } from 'src/common/utils/generatepassword';
import { PaginationResult, paginate } from 'src/common/pipes/pagination.util';
import {Role} from '../../common/constants'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly passwordGenerator: PasswordGenerator,
  ) {
    // remove password while returning user data
    this.userRepository.metadata.columns
      .filter((column) => column.propertyName === 'password')
      .forEach((column) => {
        column.isSelect = false;
      });
    Logger.info('UsersService initialized');

    //remove refresh token while returning user data
    this.userRepository.metadata.columns
      .filter((column) => column.propertyName === 'refreshToken')
      .forEach((column) => {
        column.isSelect = false;
      });
  }

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
    createUserDto.password = hashedPassword;
    const newUser = this.userRepository.create(createUserDto);

    try {
      const savedUser = await this.userRepository.save(newUser);

      await this.emailService.sendAccountCreationEmail(
        savedUser.email,
        password,
      );

      Logger.info(`User with ID ${savedUser.id} created successfully`);
      return savedUser;
    } catch (error) {
      Logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  async findAll(page = 1, limit = 1000): Promise<PaginationResult<User>> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
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
      data: user,
    };
  }

  // user.service.ts
async banUserByEmail(email: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) return;

  user.role =  Role.BANNED; 
  await this.userRepository.save(user);

  await this.emailService.sendBannedAccountNotification(email);
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
