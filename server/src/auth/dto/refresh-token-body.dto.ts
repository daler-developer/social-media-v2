import { IsNumber, IsString, MinLength } from 'class-validator'

export class RefreshTokenBodyDto {
  @IsString()
  token: string
}
