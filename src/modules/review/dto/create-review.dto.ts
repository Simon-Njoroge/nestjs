import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID of the user writing the review' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 2, description: 'ID of the tour package being reviewed' })
  @IsInt()
  tourPackageId: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Rating from 1 to 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Amazing experience!', description: 'Text of the review' })
  @IsString()
  comment: string;
}
