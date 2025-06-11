import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateTourPackageDto {
  @ApiProperty({ description: 'Title of the tour package' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed description of the tour package' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Location of the tour package' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Price of the tour package', example: 199.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Duration in days of the tour package',
    example: 5,
  })
  @IsNumber()
  @IsPositive()
  durationDays: number;

  @ApiProperty({
    description: 'Optional image URL for the tour package',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
