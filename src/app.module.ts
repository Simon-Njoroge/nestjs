import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
import { LoggerMiddleware } from './common/middleware/logger.middleware'; // adjust path as needed

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes, or customize to e.g. { path: 'seed', method: RequestMethod.POST }
  }
}
