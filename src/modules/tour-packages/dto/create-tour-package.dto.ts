import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUrl,
  IsArray,
  Min,
} from 'class-validator';

export class CreateTourPackageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @IsArray()
  @IsOptional()
  itinerary?: string[];
}
