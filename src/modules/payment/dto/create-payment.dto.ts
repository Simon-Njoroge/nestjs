import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'ID of the associated booking' })
  bookingId: number;

  @ApiProperty({
    example: 'MPESA123456',
    description: 'Transaction ID of the payment',
  })
  transactionId: string;

  @ApiProperty({ example: 150.75, description: 'Amount paid' })
  amount: number;

  @ApiProperty({ example: '254712345678', description: 'Phone number used for payment' })
  phone: string;

  @ApiProperty({
    example: '2025-06-10T12:34:56.000Z',
    description: 'Timestamp when payment was made',
  })
  paidAt: Date;

  @ApiProperty({ example: 'mpesa', description: 'Payment method used' })
  method: string;

  @ApiProperty({
    example: 'success',
    enum: ['success', 'failed', 'pending'],
    description: 'Status of the payment',
  })
  status: 'success' | 'failed' | 'pending';
}
