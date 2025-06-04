import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

 export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,

    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Sign up (register) a new user:
   * 1) Check if email already exists.
   * 2) Hash password, create User.
   * 3) Issue access + refresh tokens.
   * 4) Save one Auth record with the (hashed) refresh token + expiry.
   */
  // async signup(dto: CreateAuthDto) {
  //   const existing = await this.userRepo.findOne({ where: { email: dto.email } });
  //   if (existing) {
  //     throw new UnauthorizedException('Email already in use');
  //   }

  //   // 1) Hash password
  //   const hashedPassword = await bcrypt.hash(dto.password, 10);

  //   // 2) Create user
  //   const newUser = this.userRepo.create({
  //     email: dto.email,
  //     password: hashedPassword,
  //     firstName: dto.firstName,
  //     lastName: dto.lastName,
  //     role: dto.role ?? undefined,
  //     phoneNumber: dto.phoneNumber ?? undefined,
  //     profilePicture: dto.profilePicture ?? undefined,
  //   });
  //   await this.userRepo.save(newUser);

  //   // 3) Issue tokens
  //   const { access_token, refresh_token } = await this.generateTokens(
  //     newUser.id,
  //     newUser.email,
  //   );

  //   // 4) Save one Auth record for this user
  //   const expiresInDays = Number(this.config.get<number>('REFRESH_TOKEN_EXPIRES_DAYS') || 7);
  //   const expiresAt = new Date();
  //   expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  //   const hashedRt = await bcrypt.hash(refresh_token, 10);

  //   const authRecord = this.authRepo.create({
  //     user: newUser,
  //     refreshToken: hashedRt,
  //     expiresAt,
  //   });
  //   await this.authRepo.save(authRecord);

  //   return { access_token, refresh_token };
  // }

  /**
   * Log in an existing user:
   * 1) Fetch user by email, compare passwords.
   * 2) Issue new tokens.
   * 3) Update or create an Auth row for that user’s refresh token.
   * 4) Update lastLogin timestamp on the User.
   */
  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Issue tokens
    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.email,
    );

    // Calculate expiry
    const expiresInDays = Number(this.config.get<number>('REFRESH_TOKEN_EXPIRES_DAYS') || 7);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Hash the refresh token
    const hashedRt = await bcrypt.hash(refresh_token, 10);

    // Either update existing Auth record or create a new one
    const existingAuth = await this.authRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (existingAuth) {
      existingAuth.refreshToken = hashedRt;
      existingAuth.expiresAt = expiresAt;
      await this.authRepo.save(existingAuth);
    } else {
      const newAuth = this.authRepo.create({
        user: { id: user.id } as User,
        refreshToken: hashedRt,
        expiresAt,
      });
      await this.authRepo.save(newAuth);
    }

    // Update lastLogin on User
    await this.userRepo.update(user.id, { lastLogin: new Date() });

    return { access_token, refresh_token };
  }

  /**
   * Refresh access + refresh tokens:
   * 1) Find the Auth record for this userId.
   * 2) Compare the incoming refreshToken to the hashed one in Auth.
   * 3) Check expiry (expiresAt).
   * 4) Issue new tokens, update Auth record’s refreshToken and expiresAt.
   */
  async refreshTokens(userId: string, incomingRt: string) {
    const authRecord = await this.authRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (
      !authRecord ||
      !authRecord.refreshToken ||
      authRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const matches = await bcrypt.compare(incomingRt, authRecord.refreshToken);
    if (!matches) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    // Issue brand‐new tokens
    const { access_token, refresh_token } = await this.generateTokens(
      userId,
      authRecord.user.email,
    );

    // Compute new expiry
    const expiresInDays = Number(this.config.get<number>('REFRESH_TOKEN_EXPIRES_DAYS') || 7);
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + expiresInDays);

    const newHashedRt = await bcrypt.hash(refresh_token, 10);
    authRecord.refreshToken = newHashedRt;
    authRecord.expiresAt = newExpiresAt;
    await this.authRepo.save(authRecord);

    return { access_token, refresh_token };
  }

  /**
   * Logout (invalidate all refresh‐token sessions for this user)
   */
  async logout(userId: string): Promise<DeleteResult> {
    return this.authRepo.delete({ user: { id: userId } });
  }

  // ─── HELPER: generate JWT access + refresh tokens ────────────────────────────
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') || '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') || '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
