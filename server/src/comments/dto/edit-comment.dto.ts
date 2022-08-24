import { IsString, MaxLength, MinLength } from 'class-validator'

export class EditCommentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  text: string
}
