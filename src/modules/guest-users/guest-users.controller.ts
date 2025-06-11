import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GuestUsersService } from './guest-users.service';
import { CreateGuestUserDto } from './dto/create-guest-user.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GuestUser } from './entities/guest-user.entity';
import { Claims } from 'src/common/decorators/claims.decorator';
import { ClaimsGuard } from 'src/common/guards/claims.guard';
import { AtGuard } from 'src/common/guards/at.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('guest')
@ApiBearerAuth()
@Controller('guest-users')
export class GuestUsersController {
  constructor(private readonly guestUsersService: GuestUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new guest user' })
  @ApiResponse({
    status: 201,
    description: 'Guest user created successfully',
    type: GuestUser,
  })
  create(@Body() createGuestUserDto: CreateGuestUserDto): Promise<GuestUser> {
    return this.guestUsersService.create(createGuestUserDto);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:guestusers')
  @Get()
  @ApiOperation({ summary: 'Get all guest users' })
  @ApiResponse({
    status: 200,
    description: 'List of all guest users',
    type: [GuestUser],
  })
  findAll(): Promise<GuestUser[]> {
    return this.guestUsersService.findAll();
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:guestusers')
  @Get(':id')
  @ApiOperation({ summary: 'Get guest user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Guest user details',
    type: GuestUser,
  })
  @ApiResponse({ status: 404, description: 'Guest user not found' })
  findOne(@Param('id') id: string): Promise<GuestUser> {
    return this.guestUsersService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete guest user by ID' })
  @ApiResponse({ status: 200, description: 'Guest user deleted successfully' })
  @ApiResponse({ status: 404, description: 'Guest user not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.guestUsersService.remove(+id);
  }
}
