import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsEnum,
} from 'class-validator';

export enum TicketStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class CreateTicketDto {
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsUUID()
  @IsNotEmpty()
  tourPackageId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;
}
