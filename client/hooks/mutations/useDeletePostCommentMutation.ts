import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IComment, IPost } from 'utils/types'
import * as commentsApi from '../../api/comments'

export default ({ comment: commentDeleting }: { comment: IComment }) => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosErrorResponseType, void>(
    async () => {
      await commentsApi.deleteComment({ commentId: commentDeleting._id })
    },
    {
      onSuccess() {
        // update post num comments field
        queryClient.setQueriesData(
          ['posts', 'list'],
          (oldData?: InfiniteData<IPost[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) => {
                return page.map((post) => {
                  if (post._id === commentDeleting.postId) {
                    return { ...post, numComments: post.numComments - 1 }
                  }
                  return post
                })
              })

              return {
                pageParams: oldData?.pageParams,
                pages: newPages,
              }
            }
          }
        )

        // update comments list
        queryClient.setQueriesData(
          ['comments', 'list'],
          (oldData?: InfiniteData<IComment[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) =>
                page.filter((comment) => comment._id !== commentDeleting._id)
              )

              return {
                pages: newPages,
                pageParams: oldData.pageParams,
              }
            }
          }
        )
      },
    }
  )
}
