import { Injectable } from '@nestjs/common';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';

@Injectable()
export class TourPackagesService {
  create(createTourPackageDto: CreateTourPackageDto) {
    return 'This action adds a new tourPackage';
  }

  findAll() {
    return `This action returns all tourPackages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourPackage`;
  }

  update(id: number, updateTourPackageDto: UpdateTourPackageDto) {
    return `This action updates a #${id} tourPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourPackage`;
  }
}
