import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 1, description: 'ID of the associated Tour Package' })
  @IsNumber()
  @IsNotEmpty()
  tourPackageId: number;

  @ApiProperty({ example: 101, description: 'ID of the associated Booking' })
  @IsNumber()
  @IsNotEmpty()
  bookingId: number;

  @ApiProperty({ example: 'John Doe', description: 'Name of the traveler' })
  @IsString()
  @IsNotEmpty()
  travelerName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of the traveler' })
  @IsEmail()
  travelerEmail: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the traveler' })
  @IsString()
  @IsNotEmpty()
  travelerPhone: string;
}
