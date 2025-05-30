import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateAdminLogDto {
  @IsUUID()
  @IsNotEmpty()
  adminId: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsOptional()
  description?: string;
}
