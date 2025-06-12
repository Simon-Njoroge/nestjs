import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Inquiry } from './entities/inquiry.entity';
import { Claims } from 'src/common/decorators/claims.decorator';
import { ClaimsGuard } from 'src/common/guards/claims.guard';
import { AtGuard } from 'src/common/guards/at.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiryService: InquiriesService) {}

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'create:inquiry')
  @Post()
  @ApiOperation({ summary: 'Submit an inquiry (by user or guest)' })
  @ApiResponse({
    status: 201,
    description: 'Inquiry successfully created.',
    type: Inquiry,
  })
  create(@Body() createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    return this.inquiryService.create(createInquiryDto);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:inquiries')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries' })
  @ApiResponse({
    status: 200,
    description: 'List of all inquiries.',
    type: [Inquiry],
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 1000) {
    return this.inquiryService.findAll(Number(page), Number(limit));
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:inquiries')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiResponse({ status: 200, description: 'Inquiry details.', type: Inquiry })
  @ApiResponse({ status: 404, description: 'Inquiry not found.' })
  findOne(@Param('id') id: string): Promise<Inquiry> {
    return this.inquiryService.findOne(+id);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'delete:inquiry')
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
