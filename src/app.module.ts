import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import Keyv from 'keyv';

import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Your modules...
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuestUsersModule } from './modules/guest-users/guest-users.module';
import { TourPackagesModule } from './modules/tour-packages/tour-packages.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { AdminLogsModule } from './modules/admin-logs/admin-logs.module';
import { SeedModule } from './modules/seed/seed.module';
import { LogsModule } from './modules/logs/logs.module';
import {  CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-ioredis';
@Module({
  imports: [
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
    UsersModule,
    AdminModule,
    AuthModule,
    GuestUsersModule,
    TourPackagesModule,
    BookingsModule,
    TicketsModule,
    InquiriesModule,
    AdminLogsModule,
    SeedModule,
    LogsModule,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
