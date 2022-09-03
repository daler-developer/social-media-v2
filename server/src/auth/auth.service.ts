import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { NotAuthenticatedException } from 'src/core/errors'

@Injectable()
export class AuthService {
  generateAccessToken({ userId }: { userId: Types.ObjectId }) {
    const accessToken = jwt.sign({ userId }, 'jwt_secret', {
      expiresIn: '2 days',
    })

    return accessToken
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, 'jwt_secret') as jwt.JwtPayload
    } catch (e) {
      throw new NotAuthenticatedException()
    }
  }

  refreshToken(token: string) {}
}
