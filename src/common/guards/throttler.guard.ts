import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(): Promise<void> {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message:
          '⏳ Too many requests 😤. Please slow down and try again later.',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  protected getTracker(req: Record<string, any>): string {
    // Use user ID if available, otherwise fallback to IP
    return req.user?.id?.toString() || req.ip;
  }
}
