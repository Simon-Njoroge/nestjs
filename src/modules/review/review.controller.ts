import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Review } from './entities/review.entity';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created', type: Review })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of all reviews', type: [Review] })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, description: 'Review found', type: Review })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({ status: 200, description: 'Review updated', type: Review })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({ status: 204, description: 'Review deleted' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
