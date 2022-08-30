import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost } from 'utils/types'
import * as postsApi from '../../api/posts'

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
      await postsApi.unlikePost({ postId })

      return { postId }
    },
    {
      onSuccess({ postId }) {
        queryClient.setQueriesData(
          ['posts', 'list'],
          (oldData?: InfiniteData<IPost[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) =>
                page.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        isLikedByCurrentUser: false,
                        numLikes: post.numLikes - 1,
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
