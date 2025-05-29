import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  tourPackageId: string;

  @IsDateString()
  @IsOptional()
  bookingDate?: Date;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  numberOfPeople: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalAmount: number;

  @IsUUID()
  @IsOptional()
  guestUserId?: string;
}
