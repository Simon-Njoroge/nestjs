import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/common/utils/email/email.service';
import { Role } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'fullName',
        'role',
        'phone',
        'refreshToken',
        'claims',
      ],
    });
    if (!user) return new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return new UnauthorizedException('Invalid password');
    if (user.role === Role.BANNED) {
      await this.userRepo.update(user.id, { lastLogin: new Date() });
      // Optionally, you can log the attempt or notify the user
      await this.emailService.sendBannedAccountNotification(user.email);
      // Return a specific error for banned accounts
      return new UnauthorizedException('Your account has been banned');
    }
    const tokens = await this.getTokens(user.id, user.email, user.claims);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    await this.userRepo.update(user.id, { lastLogin: new Date() });

    return {
      tokens
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'refreshToken', 'claims'],
    });
    if (!user || !refreshToken)
      throw new UnauthorizedException('Access Denied');

    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!match) return new UnauthorizedException('Invalid refresh token');

    const tokens = await this.getTokens(user.id, user.email, user.claims);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: undefined });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return {
        message:
          'If your email is registered, you will receive a password reset link.',
      };
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow('c'),
      expiresIn: '15m',
    });

    await this.emailService.sendPasswordResetEmail(user.email, token);

    return {
      message:
        'If your email is registered, you will receive a password reset link.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.getOrThrow('JWT_RESET_TOKEN_SECRET'),
      });

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new NotFoundException('User not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepo.update(user.id, { password: hashedPassword });

      return { message: 'Password reset successful. You may now log in.' };
    } catch (err) {
      return new BadRequestException('Invalid or expired token');
    }
  }

  private async getTokens(userId: number, email: string, claims: string[]) {
    const payload = { sub: userId, email, claims };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(userId, { refreshToken: hashed });
  }
}
