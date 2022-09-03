import { Transform, Type } from 'class-transformer'
import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  firstName?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  lastName?: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string

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
