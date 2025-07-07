import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the tour package the inquiry is related to',
  })
  tourPackageId: number;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'ID of the authenticated user (optional)',
  })
  userId?: number;

  @ApiProperty({
    example: 5,
    required: false,
    description: 'ID of the guest user if not logged in (optional)',
  })
  guestUserId?: number;

  @ApiProperty({
    example: 'I would like to know more about the itinerary.',
    description: 'Inquiry message',
  })
  message: string;

  @ApiProperty({
    example: '2025-06-10T14:00:00.000Z',
    description: 'Timestamp when the inquiry was submitted',
  })
  submittedAt: Date;
}
