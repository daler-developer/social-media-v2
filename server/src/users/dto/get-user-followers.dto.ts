import { Transform, Type } from 'class-transformer'
import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class GetUserFollowersQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset?: number

  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string
}
