import apiClient from 'utils/apiClient'
import { IComment } from 'utils/types'

export const getPostComments = async ({
  postId,
  offset,
}: {
  postId: string
  offset?: number
}) => {
  return await apiClient.get<{ comments: IComment[] }>(
    `/api/posts/${postId}/comments`,
    { params: { offset } }
  )
}

export const createComment = async ({
  text,
  postId,
}: {
  text: string
  postId: string
}) => {
  return await apiClient.post<{ comment: IComment }>(
    `/api/posts/${postId}/comments`,
    { text }
  )
}

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  return await apiClient.delete<{ deleted: boolean }>(
    `/api/comments/${commentId}`
  )
}

export const editComment = async ({
  text,
  commentId,
}: {
  commentId: string
  text: string
}) => {
  return await apiClient.patch<{ comment: IComment }>(
    `/api/comments/${commentId}`,
    { text }
  )
}
