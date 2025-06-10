import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'User ID placing the booking' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Tour package ID being booked' })
  @IsInt()
  tourPackageId: number;

  @ApiProperty({ description: 'Booking date and time', example: '2025-07-10T10:00:00Z' })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ description: 'Number of people for the booking' })
  @IsInt()
  numberOfPeople: number;

  @ApiProperty({
    description: 'Booking status',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'confirmed' | 'cancelled';

  @ApiProperty({ description: 'Optional notes from the user', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
