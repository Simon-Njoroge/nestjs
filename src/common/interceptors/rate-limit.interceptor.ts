// rate-limit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import rateLimit from 'express-rate-limit';
import { UsersService } from '../../modules/users/users.service';
import { TooManyRequestsException } from '../../common/filters/tooManyRequestsExceptions';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each user to 100 requests per windowMs
    handler: async (req, res, next) => {
      const email = req.user?.email;
      if (email) {
        await this.userService.banUserByEmail(email);
      }
      throw new TooManyRequestsException('Too many requests. Your account has been banned.');
    },
  });

  constructor(private readonly userService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    return new Observable((observer) => {
      this.limiter(req, res, (err) => {
        if (err) {
          observer.error(err);
        } else {
          next.handle().subscribe(observer);
        }
      });
    });
  }
}
