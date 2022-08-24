import { HttpException, HttpStatus } from '@nestjs/common'

export class RequestException extends Error {
  errorType: string
  status: HttpStatus
  errors?: any[]

  constructor({
    message,
    errorType,
    status,
    errors,
  }: {
    message: string
    errorType: string
    status: HttpStatus
    errors?: any[]
  }) {
    super(message)
    this.errorType = errorType
    this.status = status
    this.errors = errors
  }
}

export class ValidationException extends RequestException {
  static errorType = 'validation_error'
  static status = HttpStatus.BAD_REQUEST

  constructor(errors?: any[]) {
    super({
      message: 'Validation error',
      errorType: ValidationException.errorType,
      status: ValidationException.status,
      errors,
    })
  }
}

export class NotAuthenticatedException extends RequestException {
  static errorType = 'not_authenticated_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'Not authenticated',
      errorType: NotAuthenticatedException.errorType,
      status: NotAuthenticatedException.status,
    })
  }
}

export class UserNotFoundException extends RequestException {
  static errorType = 'user_not_found_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'User was not found',
      errorType: UserNotFoundException.errorType,
      status: UserNotFoundException.status,
    })
  }
}

export class CommentNotFoundException extends RequestException {
  static errorType = 'comment_not_found_error'
  static status = HttpStatus.NOT_FOUND

  constructor() {
    super({
      message: 'Comment was not found',
      errorType: CommentNotFoundException.errorType,
      status: CommentNotFoundException.status,
    })
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User alrerady exists', HttpStatus.BAD_REQUEST)
  }
}

export class IncorrectPasswordException extends HttpException {
  constructor() {
    super('Incorrect password', HttpStatus.BAD_REQUEST)
  }
}

export class AlreadyFollowingUserException extends HttpException {
  constructor() {
    super('You already follow this user', HttpStatus.BAD_REQUEST)
  }
}

export class NotFollowingUserYetException extends HttpException {
  constructor() {
    super('You are not following this user yet', HttpStatus.BAD_REQUEST)
  }
}

export class AlreadyLikedPostException extends HttpException {
  constructor() {
    super('You aleady liked this post', HttpStatus.BAD_REQUEST)
  }
}

export class NotLikedPostYetException extends HttpException {
  constructor() {
    super('You did not like this post yet', HttpStatus.BAD_REQUEST)
  }
}

export class ForbiddenToDeletePostException extends HttpException {
  constructor() {
    super('You can only delete your posts', HttpStatus.BAD_REQUEST)
  }
}

export class PostNotFoundException extends HttpException {
  constructor() {
    super('Post was not found', HttpStatus.NOT_FOUND)
  }
}

export class ForbiddenToDeleteCommentException extends HttpException {
  constructor() {
    super('You cannot delete this comment', HttpStatus.FORBIDDEN)
  }
}

export class ForbiddenToEditCommentException extends HttpException {
  constructor() {
    super('You cannot edit this comment', HttpStatus.FORBIDDEN)
  }
}
