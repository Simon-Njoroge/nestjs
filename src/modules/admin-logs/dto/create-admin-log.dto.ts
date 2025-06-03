import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAdminLogDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  adminId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
