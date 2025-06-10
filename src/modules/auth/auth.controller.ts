import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
interface LoginDto {
  email: string;
  password: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { Logger } from 'src/common/utils/logger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // @ApiOperation({ summary: 'Register a new user' })
  // @ApiResponse({ status: 201, description: 'User registered successfully' })
  // async signup(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.signup(createAuthDto);
  // }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Tokens returned on successful login',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get new tokens with refresh token' })
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(@Param('id') id: number) {
    Logger.info('logged out successfully');
    return this.authService.logout(id);
  }
  
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  
  @Public()
  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
