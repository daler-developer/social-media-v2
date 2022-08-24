import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { ValidationException } from '../errors'

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      throw new ValidationException(errors)
    }

    return object
  }
}
