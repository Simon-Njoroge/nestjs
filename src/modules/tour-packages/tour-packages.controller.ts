import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourPackagesService } from './tour-packages.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';

@Controller('tour-packages')
export class TourPackagesController {
  constructor(private readonly tourPackagesService: TourPackagesService) {}

  @Post()
  create(@Body() createTourPackageDto: CreateTourPackageDto) {
    return this.tourPackagesService.create(createTourPackageDto);
  }

  @Get()
  findAll() {
    return this.tourPackagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourPackagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourPackageDto: UpdateTourPackageDto) {
    return this.tourPackagesService.update(+id, updateTourPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourPackagesService.remove(+id);
  }
}
