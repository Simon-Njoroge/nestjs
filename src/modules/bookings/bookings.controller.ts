import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Booking>): Promise<Booking> {
    return this.bookingsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Booking>): Promise<Booking> {
    return this.bookingsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}
