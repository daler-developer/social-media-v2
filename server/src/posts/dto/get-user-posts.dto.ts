import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class GetUserPostsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset?: number

  @IsOptional()
  @IsString()
  search?: string
}
