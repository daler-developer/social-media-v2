import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IComment, IPost } from 'utils/types'
import * as commentsApi from '../../api/comments'
import type { DataType as GetFeedPostsQueryDataType } from '../queries/useGetFeedPostsQuery'

interface IParams {
  text: string
}

type DataType = IComment

export default ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<DataType, AxiosErrorResponseType, IParams>(
    async ({ text }) => {
      const { data } = await commentsApi.createComment({ postId, text })

      return data.comment
    },
    {
      onSuccess(comment) {
        // update post num comments field
        queryClient.setQueriesData(
          ['posts', 'list'],
          (oldData?: InfiniteData<IPost[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) => {
                return page.map((post) => {
                  if (post._id === postId) {
                    return { ...post, numComments: post.numComments + 1 }
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
        queryClient.setQueryData(
          ['comments', 'list', { postId }],
          (oldData?: InfiniteData<IComment[]>) => {
            if (oldData) {
              const newPages = [[comment], ...oldData.pages]
              const newPageParams = [undefined, ...oldData.pageParams]

              return {
                pages: newPages,
                pageParams: newPageParams,
              }
            }
          }
        )
      },
    }
  )
}
