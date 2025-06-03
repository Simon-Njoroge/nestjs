import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateInquiryDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  tourPackageId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
