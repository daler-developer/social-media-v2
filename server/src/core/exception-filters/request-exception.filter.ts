import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import { RequestException } from '../errors'

@Catch(RequestException)
export class RequestExceptionFilter implements ExceptionFilter {
  catch(exception: RequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    console.log('request error')

    response.status(exception.status).json({
      message: exception.message,
      errorType: exception.errorType,
      errors: exception.errors,
    })
  }
}
