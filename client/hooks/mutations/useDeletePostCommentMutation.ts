import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IComment, IPost } from 'utils/types'
import * as commentsApi from '../../api/comments'

export default ({ commentId }: { commentId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosErrorResponseType, void>(
    async () => {
      await commentsApi.deleteComment({ commentId })
    },
    {
      onSuccess() {
        queryClient.setQueriesData(
          ['comments', 'list'],
          (oldData?: InfiniteData<IComment[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) =>
                page.filter((comment) => comment._id !== commentId)
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
