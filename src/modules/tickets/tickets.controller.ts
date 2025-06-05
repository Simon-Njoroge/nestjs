import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(): Promise<Ticket[]> {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Ticket>): Promise<Ticket> {
    return this.ticketsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Ticket>): Promise<Ticket> {
    return this.ticketsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}