import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';
import { Role } from '../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiProperty({
    required: false,
    description: 'List of claims (permissions) assigned to the user',
    example: ['admin', 'can-edit-packages', 'can-view-reports'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  claims?: string[];
}
