import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Ticket } from './entities/ticket.entity';

@ApiTags('Tickets')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created', type: Ticket })
  create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'List of tickets', type: [Ticket] })
  findAll(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Found ticket', type: Ticket })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Updated ticket', type: Ticket })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ticketService.remove(id);
  }
}
