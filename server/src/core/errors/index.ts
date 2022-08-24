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

export class UserAlreadyExistsException extends RequestException {
  static errorType = 'user_already_exists_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'User already exists',
      errorType: UserAlreadyExistsException.errorType,
      status: UserAlreadyExistsException.status,
    })
  }
}

export class IncorrectPasswordException extends RequestException {
  static errorType = 'incorrect_password_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'Incorrect password',
      errorType: IncorrectPasswordException.errorType,
      status: IncorrectPasswordException.status,
    })
  }
}

export class AlreadyFollowingUserException extends RequestException {
  static errorType = 'already_following_user_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'You already follow this user',
      errorType: IncorrectPasswordException.errorType,
      status: IncorrectPasswordException.status,
    })
  }
}

export class NotFollowingUserYetException extends RequestException {
  static errorType = 'not_following_user_yet_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'You are not following this user yet',
      errorType: NotFollowingUserYetException.errorType,
      status: NotFollowingUserYetException.status,
    })
  }
}

export class AlreadyLikedPostException extends RequestException {
  static errorType = 'already_liked_post_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'You already liked this post',
      errorType: AlreadyLikedPostException.errorType,
      status: AlreadyLikedPostException.status,
    })
  }
}

export class NotLikedPostYetException extends RequestException {
  static errorType = 'not_liked_post_yet_error'
  static status = HttpStatus.BAD_REQUEST

  constructor() {
    super({
      message: 'You did not like this post yet',
      errorType: NotLikedPostYetException.errorType,
      status: NotLikedPostYetException.status,
    })
  }
}

export class ForbiddenToDeletePostException extends RequestException {
  static errorType = 'forbidden_to_delete_post_error'
  static status = HttpStatus.FORBIDDEN

  constructor() {
    super({
      message: 'You are forbidden to delete post',
      errorType: ForbiddenToDeletePostException.errorType,
      status: ForbiddenToDeletePostException.status,
    })
  }
}

export class PostNotFoundException extends RequestException {
  static errorType = 'post_not_found_error'
  static status = HttpStatus.NOT_FOUND

  constructor() {
    super({
      message: 'Post not found',
      errorType: PostNotFoundException.errorType,
      status: PostNotFoundException.status,
    })
  }
}

export class ForbiddenToDeleteCommentException extends RequestException {
  static errorType = 'forbidden_to_delete_comment_error'
  static status = HttpStatus.FORBIDDEN

  constructor() {
    super({
      message: 'You are forbidden to delete comment',
      errorType: ForbiddenToDeleteCommentException.errorType,
      status: ForbiddenToDeleteCommentException.status,
    })
  }
}

export class ForbiddenToEditCommentException extends RequestException {
  static errorType = 'forbidden_to_edit_comment_error'
  static status = HttpStatus.FORBIDDEN

  constructor() {
    super({
      message: 'You are forbidden to edit comment',
      errorType: ForbiddenToEditCommentException.errorType,
      status: ForbiddenToEditCommentException.status,
    })
  }
}
