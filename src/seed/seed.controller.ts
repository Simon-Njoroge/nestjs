import { Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding database...');
    try {
      await this.seedService.seed();
      this.logger.log('Database seeded successfully');
      return { message: 'Database seeded successfully' };
    } catch (error) {
      this.logger.error('Error seeding database', error.stack || error.message);
      throw error;
    }
  }
}
