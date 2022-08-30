import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost } from 'utils/types'
import * as postsApi from '../../api/posts'
import type { DataType as GetFeedPostsQueryDataType } from '../queries/useGetFeedPostsQuery'

interface IParams {
  postId: string
}

interface IData {
  postId: string
}

export default () => {
  const queryClient = useQueryClient()

  return useMutation<IData, AxiosErrorResponseType, IParams>(
    async ({ postId }) => {
      await postsApi.likePost({ postId })

      return { postId }
    },
    {
      onSuccess({ postId }) {
        queryClient.setQueriesData(
          ['posts', 'list'],
          (oldData?: InfiniteData<GetFeedPostsQueryDataType>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) =>
                page.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        isLikedByCurrentUser: true,
                        numLikes: post.numLikes + 1,
                      }
                    : post
                )
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
