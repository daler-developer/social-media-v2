import { Transform, Type } from 'class-transformer'
import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class GetPostLikersQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset?: number
}
