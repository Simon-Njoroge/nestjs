import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TourPackagesService } from './tour-packages.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AtGuard } from 'src/common/guards/at.guard';
import { TourPackage } from './entities/tour-package.entity';
import { Claims } from 'src/common/decorators/claims.decorator';
import { ClaimsGuard } from 'src/common/guards/claims.guard';

@ApiTags('Tours')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('tour-packages')
export class TourPackagesController {
  constructor(private readonly tourPackageService: TourPackagesService) {}

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'add:tourpackage')
  @Post()
  @ApiOperation({ summary: 'Create a new tour package' })
  @ApiResponse({
    status: 201,
    description: 'Tour package created',
    type: TourPackage,
  })
  create(@Body() createTourPackageDto: CreateTourPackageDto) {
    return this.tourPackageService.create(createTourPackageDto);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:tourpackage')
  @Get()
  @ApiOperation({ summary: 'Get all tour packages' })
  @ApiResponse({
    status: 200,
    description: 'List of tour packages',
    type: [TourPackage],
  })
  findAll() {
    return this.tourPackageService.findAll();
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'get:tourpackage')
  @Get(':id')
  @ApiOperation({ summary: 'Get a single tour package by ID' })
  @ApiResponse({
    status: 200,
    description: 'Tour package details',
    type: TourPackage,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tourPackageService.findOne(id);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'update:tourpackage')
  @Put(':id')
  @ApiOperation({ summary: 'Update a tour package by ID' })
  @ApiResponse({
    status: 200,
    description: 'Tour package updated',
    type: TourPackage,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTourPackageDto: UpdateTourPackageDto,
  ) {
    return this.tourPackageService.update(id, updateTourPackageDto);
  }

  @UseGuards(AtGuard, ClaimsGuard)
  @Claims('admin', 'delete:ourpackage')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tour package by ID' })
  @ApiResponse({ status: 200, description: 'Tour package deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tourPackageService.remove(id);
  }
}
