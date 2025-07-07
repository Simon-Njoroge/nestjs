import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../utils/email/email.service';
import { TooManyRequestsException } from '../filters/tooManyRequestsExceptions';
import { Role } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BannedThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super(options, storageService, reflector);
  }

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    try {
      return await super.handleRequest(context, limit, ttl);
    } catch (err) {
      const req = context.switchToHttp().getRequest();
      let email: string | undefined;

      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
          const decoded = this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          });
          email = decoded.email;
        } catch (tokenErr) {
          console.error('Invalid or expired access token', tokenErr);
        }
      }

      if (email) {
        // Ban user and send email
        await this.userService.banUserByEmail(email);
        try {
          await this.emailService.sendBannedAccountNotification(email);
        } catch (emailErr) {
          console.error('Failed to send banned account notification email:', emailErr);
        }
      } else {
        console.warn('User email not found in token. Cannot ban.');
      }

      throw new TooManyRequestsException(
        'You have exceeded the request limit. Your account has been banned.',
      );
    }
  }
}
