import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}


  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email }, select: ['id', 'email', 'password', 'refreshToken'] });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(Number(user.id), user.email);
    await this.updateRefreshToken(Number(user.id), tokens.refresh_token);
    await this.userRepo.update(user.id, { lastLogin: new Date() });

    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: string ) {
    const user = await this.userRepo.findOne({ where: { id: String(userId) } });
    if (!user || !user.refreshToken) throw new UnauthorizedException('Access Denied');

    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.getTokens(Number(user.id), user.email);
    await this.updateRefreshToken(Number(user.id), tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: undefined });
  }

  // ---------------- Helper Methods ----------------
  private async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
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
