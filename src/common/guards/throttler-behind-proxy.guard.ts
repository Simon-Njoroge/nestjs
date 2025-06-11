// throttler-behind-proxy.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Logger } from 'src/common/utils/logger';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // If behind a proxy, req.ips[0] is the actual client IP
    return req.ips?.length ? req.ips[0] : req.ip;
  }

  async handleRequest(context: ExecutionContext, limit: number, ttl: number) {
    const req = context.switchToHttp().getRequest();
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.connection.remoteAddress ||
      req.ip;
    const key = this.generateKey(context, ip);

    const record = await this.storageService.getRecord(key);
    const currentHits = record.length;
    if (currentHits >= limit) {
      Logger.warn(`Rate limit exceeded by IP: ${ip}`);
      throw this.throwThrottlingException(context);
    }
    await this.storageService.addRecord(key, ttl);

    return true;
  }
}
