import { Body, Controller, Get, HttpException, Post, Res, UsePipes } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Response } from 'express'
import { Types } from 'mongoose'
import { IncorrectPasswordException, UserAlreadyExistsException, UserNotFoundException } from 'src/core/errors'
import { ValidationPipe } from 'src/core/pipes/validation.pipe'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenBodyDto } from './dto/refresh-token-body.dto'

@Controller('/api')
export class AuthController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Post('/auth/register')
  async register(@Body(ValidationPipe) body: CreateUserDto, @Res() res: Response) {
    if (await this.usersService.userWithUsernameExists(body.username)) {
      throw new UserAlreadyExistsException()
    }
    const user = await this.usersService.createUser(body)
    const accessToken = this.authService.generateAccessToken({
      userId: new Types.ObjectId(user._id),
    })

    return res.status(200).json({
      user,
      accessToken,
    })
  }

  @Post('/auth/login')
  async login(@Body(ValidationPipe) body: LoginDto, @Res() res: Response) {
    const candidate = await this.usersService.getUserByUsernameOrFailIfNotExists(body.username)

    const passwordDoesNotMatch = !(await this.usersService.checkIfPasswordMatches({
      userId: candidate._id,
      password: body.password,
    }))

    if (passwordDoesNotMatch) {
      throw new IncorrectPasswordException()
    }

    const accessToken = this.authService.generateAccessToken({ userId: candidate._id })

    return res.status(200).json({ user: candidate, accessToken })
  }
}
