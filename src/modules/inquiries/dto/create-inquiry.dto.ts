import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateInquiryDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  tourPackageId?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
