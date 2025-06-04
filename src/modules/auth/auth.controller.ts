import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // @ApiOperation({ summary: 'Register / sign up a new user' })
  // @ApiResponse({ status: 201, description: 'User registered, tokens returned' })
  // @ApiResponse({ status: 401, description: 'Email already in use' })
  // async signup(@Body() dto: CreateAuthDto) {
  //   return this.authService.signup(dto);
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email + password' })
  @ApiResponse({ status: 200, description: 'Tokens returned on successful login' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Provide userId + refreshToken to get new tokens' })
  @ApiResponse({ status: 200, description: 'New tokens returned' })
  @ApiResponse({ status: 401, description: 'Refresh token invalid or expired' })
  async refresh(
    @Body() body: { userId: string; refreshToken: string },
  ) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out (invalidate all refresh sessions)' })
  @ApiResponse({ status: 200, description: 'All sessions for user removed' })
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }
}
