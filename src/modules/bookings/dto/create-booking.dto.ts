import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBookingDto {

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tourPackageId: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  bookingDate?: Date;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  numberOfPeople: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  guestUserId?: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
