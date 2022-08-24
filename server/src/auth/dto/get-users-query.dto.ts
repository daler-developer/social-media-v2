import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class GetUsersQueryDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number
}
