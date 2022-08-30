import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IComment, IPost } from 'utils/types'
import * as commentsApi from '../../api/comments'

export type DataType = IComment[]

export default ({ postId, enabled }: { postId: string; enabled: boolean }) => {
  return useInfiniteQuery<DataType, AxiosErrorResponseType>(
    ['comments', 'list', { postId }],
    async ({ pageParam }) => {
      const { data } = await commentsApi.getPostComments({
        offset: pageParam,
        postId,
      })

      return data.comments
    },
    {
      enabled,
      getNextPageParam(_, pages) {
        const nextOffset = pages.reduce((acc, page) => acc + page.length, 0)

        return nextOffset
      },
    }
  )
}
