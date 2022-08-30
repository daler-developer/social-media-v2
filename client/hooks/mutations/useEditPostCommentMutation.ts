import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IComment, IPost } from 'utils/types'
import * as commentsApi from '../../api/comments'

interface IParams {
  text: string
}

type DataType = IComment

export default ({ commentId }: { commentId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<DataType, AxiosErrorResponseType, IParams>(
    async ({ text }) => {
      const { data } = await commentsApi.editComment({ commentId, text })

      return data.comment
    },
    {
      onSuccess(updatedComment) {
        queryClient.setQueriesData(
          ['comments', 'list'],
          (oldData?: InfiniteData<IComment[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((page) =>
                page.map((comment) => {
                  if (comment._id === updatedComment._id) {
                    return updatedComment
                  } else {
                    return comment
                  }
                })
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
