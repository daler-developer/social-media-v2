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
      await postsApi.deletePost({ postId })

      return { postId }
    },
    {
      onSuccess({ postId }) {
        queryClient.setQueriesData(
          ['posts', 'list'],
          (oldData?: InfiniteData<IPost[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) =>
                page.filter((post) => post._id !== postId)
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
