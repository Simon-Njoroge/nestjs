import { IsUUID, IsString, IsDateString } from 'class-validator';

export class CreateAuthDto {
  @IsUUID()
  userId: string;

  @IsString()
  refreshToken: string;

  @IsDateString()
  expiresAt: Date;
}
