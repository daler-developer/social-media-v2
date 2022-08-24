import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  text: string
}
