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
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email, user.claims);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    await this.userRepo.update(user.id, { lastLogin: new Date() });

    return {
      tokens,
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        claims: user.claims,
      },
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
    if (!match) throw new UnauthorizedException('Invalid refresh token');

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
      secret: this.config.getOrThrow('JWT_RESET_TOKEN_SECRET'),
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
      throw new BadRequestException('Invalid or expired token');
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
