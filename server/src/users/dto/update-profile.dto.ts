import { Transform, Type } from 'class-transformer'
import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'yes') {
      return true
    }
    if (value === 'no') {
      return false
    }
  })
  removeAvatar?: boolean
}
