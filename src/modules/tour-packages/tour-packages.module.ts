import { Module } from '@nestjs/common';
import { TourPackagesService } from './tour-packages.service';
import { TourPackagesController } from './tour-packages.controller';

@Module({
  controllers: [TourPackagesController],
  providers: [TourPackagesService],
})
export class TourPackagesModule {}
