import { AxiosError } from 'axios'

export type ErrorType =
  | 'validation_error'
  | 'user_not_found_error'
  | 'comment_not_found_error'
  | 'user_already_exists_error'
  | 'incorrect_password_error'
  | 'already_following_user_error'
  | 'not_following_user_yet_error'
  | 'already_liked_post_error'
  | 'not_liked_post_yet_error'
  | 'forbidden_to_delete_post_error'
  | 'post_not_found_error'
  | 'forbidden_to_delete_comment_error'
  | 'forbidden_to_edit_comment_error'

export interface IUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
  isCurrentUser?: boolean
  currentUserFollows?: boolean
  bio: string
  numPosts: number
  numFollowers: number
  numFollowings: number
}

export interface IPost {
  _id: string
  creator: IUser
  isCreatedByCurrentUser?: boolean
  isLikedByCurrentUser?: boolean
  text: string
  imageUrl: string
  numLikes: number
  numComments: number
  createdAt: string
}

export interface IComment {
  _id: string
  text: string
  postId: string
  createdAt: string
  creator: IUser
  isCreatedByCurrentUser: boolean
  postId: string
}

export type AxiosErrorResponseType = AxiosError<{
  errorType: ErrorType
  message: string
  errors?: any[]
}>
