import { IsString, MaxLength, MinLength } from 'class-validator'

export class EditCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  text: string
}
