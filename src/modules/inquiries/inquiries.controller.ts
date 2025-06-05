import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './entities/inquiry.entity';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  findAll(): Promise<Inquiry[]> {
    return this.inquiriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Inquiry> {
    return this.inquiriesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Inquiry>): Promise<Inquiry> {
    return this.inquiriesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Inquiry>): Promise<Inquiry> {
    return this.inquiriesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.inquiriesService.remove(id);
  }
}