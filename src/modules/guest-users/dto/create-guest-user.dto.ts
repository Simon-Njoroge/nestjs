import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGuestUserDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the guest user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Email address of the guest user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the guest user (optional)', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
