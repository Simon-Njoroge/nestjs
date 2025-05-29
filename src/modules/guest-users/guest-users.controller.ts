import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuestUsersService } from './guest-users.service';
import { CreateGuestUserDto } from './dto/create-guest-user.dto';
import { UpdateGuestUserDto } from './dto/update-guest-user.dto';

@Controller('guest-users')
export class GuestUsersController {
  constructor(private readonly guestUsersService: GuestUsersService) {}

  @Post()
  create(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.guestUsersService.create(createGuestUserDto);
  }

  @Get()
  findAll() {
    return this.guestUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuestUserDto: UpdateGuestUserDto,
  ) {
    return this.guestUsersService.update(+id, updateGuestUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestUsersService.remove(+id);
  }
}
