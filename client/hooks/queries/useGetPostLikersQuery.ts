import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IUser } from 'utils/types'
import * as usersApi from '../../api/users'

export type DataType = IUser[]

export default ({ postId, enabled }: { postId: string; enabled: boolean }) => {
  const query = useInfiniteQuery<DataType, AxiosErrorResponseType>(
    ['users', 'list', 'likers', { postId }],
    async ({ pageParam }) => {
      const { data } = await usersApi.getPostLikers({
        postId,
        offset: pageParam,
      })

      return data.users
    },
    {
      enabled,
      getNextPageParam(lastPage, pages) {
        const nextOffset = pages.reduce((acc, page) => acc + page.length, 0)

        return nextOffset
      },
    }
  )

  return query
}
