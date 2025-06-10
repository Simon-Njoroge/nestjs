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
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Payment } from './entities/payment.entity';

@ApiTags('Payments')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created', type: Payment })
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'List of all payments', type: [Payment] })
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found', type: Payment })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment updated', type: Payment })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.paymentService.remove(id);
  }
}
