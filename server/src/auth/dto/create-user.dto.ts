import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  firstName: string

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  lastName: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string
}
