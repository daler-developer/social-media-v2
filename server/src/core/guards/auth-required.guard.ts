import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { NotAuthenticatedException } from '../errors'
import { RequestService } from '../services/request.service'

declare module 'express' {
  interface Request {
    user?: any
  }
}

@Injectable()
export class AuthRequiredGuard implements CanActivate {
  constructor(private requestService: RequestService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.requestService.isAuthenticated) {
      return true
    }

    throw new NotAuthenticatedException()
  }
}
