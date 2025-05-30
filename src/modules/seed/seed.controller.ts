import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
// import { CreateSeedDto } from './dto/create-seed.dto';
// import { UpdateSeedDto } from './dto/update-seed.dto';
import { Logger } from '@nestjs/common/services/logger.service';
@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding the database...');
    // You can add more logging or processing here if needed
    return await this.seedService.seed();
  }
}
