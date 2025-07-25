import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { RolesGuard } from './common/guards/roles.guard';
import Keyv from 'keyv';

import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Your modules...
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GuestUsersModule } from './guest-users/guest-users.module';
import { TourPackagesModule } from './tour-packages/tour-packages.module';
import { BookingsModule } from './bookings/bookings.module';
import { TicketsModule } from './tickets/tickets.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CaslModule } from './casl/casl.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';
import * as redisStore from 'cache-manager-ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EmailModule } from './common/utils/email/email.module';
// import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';
import { BannedThrottlerGuard } from './common/guards/banned-throttler.guard';

@Module({
  imports: [
    CommonModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.getOrThrow('THROTTLE_TTL'),
        limit: config.getOrThrow('THROTTLE_LIMIT'),
        ignoreUserAgents: [/^curl\//, /^PostmanRuntime\//],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: 30,
      }),
    }),
    EmailModule,
    UsersModule,
    AuthModule,
    GuestUsersModule,
    TourPackagesModule,
    BookingsModule,
    TicketsModule,
    InquiriesModule,
    CaslModule,
    ReviewModule,
    PaymentModule,
    SeedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: RateLimitInterceptor,
    // },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    // { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
    { provide: APP_GUARD, useClass: BannedThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
