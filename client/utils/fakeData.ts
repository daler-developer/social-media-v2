import { IComment, IUser } from './types'

export const fakeComment: IComment = {
  _id: 'id001',
  createdAt: '20032452354',
  isCreatedByCurrentUser: false,
  postId: 'postid',
  text: 'fake text',
  creator: {
    _id: 'id001',
    bio: 'my bio',
    firstName: 'Daler',
    lastName: 'Saidov',
    numFollowers: 1,
    numFollowings: 1,
    numPosts: 1,
    username: 'daler',
    avatarUrl: 'url',
    currentUserFollows: false,
    isCurrentUser: true,
  },
}

export const fakeUser: IUser = {
  _id: 'id001',
  bio: 'bio',
  firstName: 'daler',
  lastName: 'saidov',
  numFollowers: 10,
  numFollowings: 10,
  numPosts: 1,
  username: 'daler',
  avatarUrl: 'url',
  isCurrentUser: true,
}
