import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  HttpCode,
  HttpStatus,
  HttpException,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Payment } from './entities/payment.entity';
import { Claims } from 'src/common/decorators/claims.decorator';
import { ClaimsGuard } from 'src/common/guards/claims.guard';
import { AtGuard } from 'src/common/guards/at.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Logger } from 'src/common/utils/logger';
@ApiTags('Payments')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    // private readonly logger: Logger = new Logger(PaymentController.name)
  ) {}

  @Public()
  @Post('stk-push')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Initiate payment via M-PESA (STK Push)' })
  @ApiResponse({ status: 201, description: 'Payment successfully processed' })
  @ApiResponse({ status: 400, description: 'Invalid booking or phone number' })
  @ApiResponse({ status: 500, description: 'M-PESA STK Push failed' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Public()
  @Post('mpesa-callback')
  @HttpCode(200)
  async handleMpesaCallback(@Req() req: Request): Promise<any> {
    const body = req.body;
    // this.logger.log('Received M-PESA Callback:');
    // this.logger.debug(JSON.stringify(body, null, 2));

    // TODO: Save transaction result, update payment status, etc.
    // For now, just acknowledge
    return { ResultCode: 0, ResultDesc: 'Success' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update a payment' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }
}
