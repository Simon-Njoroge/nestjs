import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

interface ValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  transform?: boolean;
  disableErrorMessages?: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly options?: ValidationPipeOptions) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: this.options?.whitelist,
      forbidNonWhitelisted: this.options?.forbidNonWhitelisted,
    });

    if (errors.length > 0) {
      if (this.options?.disableErrorMessages) {
        throw new BadRequestException('Validation failed');
      }
      
      // Proper error message formatting
      const message = errors
        .map(error => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return `${error.property} has invalid value`;
        })
        .join('; ');

      throw new BadRequestException(message);
    }

    return this.options?.transform ? object : value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}