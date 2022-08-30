import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost } from 'utils/types'
import * as postsApi from '../../api/posts'

export type DataType = IPost[]

export default ({ search }: { search?: string }) => {
  return useInfiniteQuery<DataType, AxiosErrorResponseType>(
    ['posts', 'list', 'feed', { search }],
    async ({ pageParam, queryKey }) => {
      const { data } = await postsApi.getFeedPosts({
        offset: pageParam,
        search,
      })

      return data.posts
    },
    {
      getNextPageParam(lastPage, pages) {
        const nextOffset = pages.reduce((acc, page) => acc + page.length, 0)

        return nextOffset
      },
    }
  )
}
