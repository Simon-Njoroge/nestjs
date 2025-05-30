import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateGuestUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
