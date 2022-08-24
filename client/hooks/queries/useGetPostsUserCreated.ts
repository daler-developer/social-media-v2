import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost } from 'utils/types'
import * as postsApi from '../../api/posts'

export type DataType = IPost[]

export default ({ search, userId }: { search?: string; userId: string }) => {
  return useInfiniteQuery<DataType, AxiosErrorResponseType>(
    ['posts', 'list', { search, creatorId: userId }],
    async ({ pageParam }) => {
      const { data } = await postsApi.getPostsUserCreated({
        offset: pageParam,
        search,
        userId,
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
