import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
// import { CreateSeedDto } from './dto/create-seed.dto';
// import { UpdateSeedDto } from './dto/update-seed.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Logger } from '@nestjs/common/services/logger.service';
@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding the database...');
    
    return await this.seedService.seed();
  }
}
