import apiClient from 'utils/apiClient'
import { IPost } from 'utils/types'

export const getFeedPosts = async ({
  offset,
  search,
}: {
  offset?: number
  search?: string
}) => {
  return await apiClient.get<{ posts: IPost[] }>('/api/feed/posts', {
    params: { offset, search },
  })
}

export const createPost = async ({
  text,
  image,
}: {
  text: string
  image: File
}) => {
  const form = new FormData()

  form.append('text', text)
  form.append('image', image)

  return await apiClient.post<{ post: IPost }>('/api/posts', form)
}

export const likePost = async ({ postId }: { postId: string }) => {
  return await apiClient.patch<{ liked: boolean }>(`/api/posts/${postId}/like`)
}

export const unlikePost = async ({ postId }: { postId: string }) => {
  return await apiClient.patch<{ liked: boolean }>(
    `/api/posts/${postId}/unlike`
  )
}

export const deletePost = async ({ postId }: { postId: string }) => {
  return await apiClient.delete<{ deleted: boolean }>(`/api/posts/${postId}`)
}

export const getPostsUserCreated = async ({
  userId,
  offset,
  search,
}: {
  userId: string
  offset?: number
  search?: string
}) => {
  return await apiClient.get<{ posts: IPost[] }>(`/api/users/${userId}/posts`, {
    params: { offset, search },
  })
}
