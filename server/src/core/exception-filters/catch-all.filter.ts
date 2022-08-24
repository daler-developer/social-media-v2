import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { RequestException } from '../errors'

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    console.log('http error')

    response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Unknown error',
      errorType: 'server_error',
    })
  }
}
