import { Transform, Type } from 'class-transformer'
import { Validate } from 'class-validator'
import { Types } from 'mongoose'
import { IsValidObjectId } from 'src/core/custom-validators'

export class GetUserFollowersParamsDto {
  @Validate(IsValidObjectId)
  userId: string
}
