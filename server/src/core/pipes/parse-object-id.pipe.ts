import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { isValidObjectId, Types } from 'mongoose'
import { ValidationException } from '../errors'

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata) {
    const notValid = !isValidObjectId(value)

    if (notValid) {
      throw new ValidationException()
    }

    return new Types.ObjectId(value)
  }
}
