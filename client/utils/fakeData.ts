import { IComment, IPost, IUser } from './types'

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

export const fakePost: IPost = {
  _id: 'id001',
  createdAt: '2022-08-29T15:24:32.881+00:00',
  creator: fakeUser,
  imageUrl: 'https://picsum.photos/seed/picsum/200/300',
  numComments: 2,
  numLikes: 10,
  text: 'hello world',
}
