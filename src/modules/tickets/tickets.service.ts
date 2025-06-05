import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  async findAll(): Promise<Ticket[]> {
    try {
      return await this.ticketRepo.find({ relations: ['user', 'tourPackage'] });
    } catch (error) {
      this.logger.error('Failed to fetch tickets', error.stack);
      throw new InternalServerErrorException('Failed to fetch tickets');
    }
  }

  async findOne(id: string): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepo.findOne({ where: { id }, relations: ['user', 'tourPackage'] });
      if (!ticket) throw new NotFoundException('Ticket not found');
      return ticket;
    } catch (error) {
      this.logger.error(`Failed to fetch ticket with id ${id}`, error.stack);
      throw error;
    }
  }

  async create(data: Partial<Ticket>): Promise<Ticket> {
    try {
      const ticket = this.ticketRepo.create(data);
      return await this.ticketRepo.save(ticket);
    } catch (error) {
      this.logger.error('Failed to create ticket', error.stack);
      throw new InternalServerErrorException('Failed to create ticket');
    }
  }

  async update(id: string, data: Partial<Ticket>): Promise<Ticket> {
    try {
      await this.ticketRepo.update(id, data);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to update ticket ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update ticket');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.ticketRepo.softDelete(id);
    } catch (error) {
      this.logger.error(`Failed to delete ticket ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete ticket');
    }
  }
}

