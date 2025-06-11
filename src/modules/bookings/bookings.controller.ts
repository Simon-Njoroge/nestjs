import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Booking } from './entities/booking.entity';
import { Claims } from 'src/common/decorators/claims.decorator';
import { ClaimsGuard } from 'src/common/guards/claims.guard';
import { AtGuard } from 'src/common/guards/at.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  async create(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(dto);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:bookings')
  @Get()
  @ApiOperation({ summary: 'Retrieve all bookings' })
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:bookings')
  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking by ID' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.bookingService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a booking' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'pending' | 'confirmed' | 'cancelled',
  ): Promise<Booking> {
    return this.bookingService.updateStatus(id, status);
  }
}
