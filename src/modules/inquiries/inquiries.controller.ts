import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Inquiry } from './entities/inquiry.entity';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiryService: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an inquiry (by user or guest)' })
  @ApiResponse({ status: 201, description: 'Inquiry successfully created.', type: Inquiry })
  create(@Body() createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    return this.inquiryService.create(createInquiryDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries' })
  @ApiResponse({ status: 200, description: 'List of all inquiries.', type: [Inquiry] })
  findAll(): Promise<Inquiry[]> {
    return this.inquiryService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiResponse({ status: 200, description: 'Inquiry details.', type: Inquiry })
  @ApiResponse({ status: 404, description: 'Inquiry not found.' })
  findOne(@Param('id') id: string): Promise<Inquiry> {
    return this.inquiryService.findOne(+id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inquiry by ID' })
  @ApiResponse({ status: 204, description: 'Inquiry deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Inquiry not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.inquiryService.remove(+id);
  }
}
