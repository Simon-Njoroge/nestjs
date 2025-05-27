import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuestUsersModule } from './modules/guest-users/guest-users.module';
import { TourPackagesModule } from './modules/tour-packages/tour-packages.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { AdminLogsModule } from './modules/admin-logs/admin-logs.module';



@Module({
  imports: [UsersModule, AdminModule, AuthModule, GuestUsersModule, TourPackagesModule, BookingsModule, TicketsModule, InquiriesModule, AdminLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
