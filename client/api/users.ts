import apiClient from 'utils/apiClient'
import { IUser } from 'utils/types'

export const getFeedUsers = async ({
  offset,
  search,
}: {
  offset?: number
  search?: string
}) => {
  return await apiClient.get<{ users: IUser[] }>('/api/feed/users', {
    params: { offset, search },
  })
}

export const getMe = async () => {
  return await apiClient.get<{ user: IUser }>('/api/users/me')
}

export const getUser = async ({ userId }: { userId: string }) => {
  return await apiClient.get<{ user: IUser }>(`/api/users/${userId}`)
}

export const followUser = async ({ userId }: { userId: string }) => {
  return await apiClient.patch<{ followed: boolean }>(
    `/api/users/${userId}/follow`
  )
}

export const unfollowUser = async ({ userId }: { userId: string }) => {
  return await apiClient.patch<{ unfollowed: boolean }>(
    `/api/users/${userId}/unfollow`
  )
}

export const getUserFollowers = async ({
  userId,
  offset,
  search,
}: {
  userId: string
  offset?: number
  search?: string
}) => {
  return await apiClient.get<{ users: IUser[] }>(
    `/api/users/${userId}/followers`,
    {
      params: { offset, search },
    }
  )
}

export const getUserFollowings = async ({
  userId,
  offset,
  search,
}: {
  userId: string
  offset?: number
  search?: string
}) => {
  return await apiClient.get<{ users: IUser[] }>(
    `/api/users/${userId}/followings`,
    {
      params: { offset, search },
    }
  )
}

export const updateProfile = async ({
  firstName,
  lastName,
  username,
  removeAvatar,
  avatar,
  bio,
}: {
  firstName?: string
  lastName?: string
  username?: string
  removeAvatar: boolean
  avatar?: File
  bio?: string
}) => {
  const form = new FormData()

  if (username) {
    form.append('username', username)
  }
  if (firstName) {
    form.append('firstName', firstName)
  }
  if (lastName) {
    form.append('lastName', lastName)
  }
  if (avatar) {
    form.append('avatar', avatar)
  }
  if (typeof bio === 'string') {
    form.append('bio', bio)
  }
  if (removeAvatar) {
    form.append('removeAvatar', 'yes')
  } else {
    form.append('removeAvatar', 'no')
  }

  return await apiClient.patch<{ user: IUser }>(
    '/api/users/me/update-profile',
    form
  )
}

export const getPostLikers = async ({
  postId,
  offset,
}: {
  postId: string
  offset?: number
}) => {
  return await apiClient.get<{ users: IUser[] }>(
    `/api/posts/${postId}/likers`,
    {
      params: { offset },
    }
  )
}
