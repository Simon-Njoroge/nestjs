import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { Auth } from './entities/auth.entity';
import { DatabaseModule } from 'src/config/database.module';
import { AtStrategy } from 'src/common/strategies/at.strategy';
import { EmailModule } from 'src/common/utils/email/email.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES') || '15m',
        },
      }),
    }),

    ConfigModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
