import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/constants';
import { AtGuard } from 'src/common/guards/at.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { ClaimsGuard } from 'src/common/guards/claims.guard';
import { RequiredClaims } from 'src/common/guards/claims.guard';
import { Claims } from 'src/common/decorators/claims.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(AtGuard, ClaimsGuard)
  // @Claims('user', 'get:users')
  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page = 1, @Query('limit') limit = 1000) {
    return this.usersService.findAll(Number(page), Number(limit));
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'update:user')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'delete:user')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
