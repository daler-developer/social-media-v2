import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost, IUser } from 'utils/types'
import * as usersApi from '../../api/users'

export type DataType = IUser[]

export default ({ search, userId }: { search?: string; userId: string }) => {
  return useInfiniteQuery<DataType, AxiosErrorResponseType>(
    ['users', 'list', 'followings', { search, userId }],
    async ({ pageParam }) => {
      const { data } = await usersApi.getUserFollowings({
        offset: pageParam,
        search,
        userId,
      })

      return data.users
    },
    {
      getNextPageParam(lastPage, pages) {
        const nextOffset = pages.reduce((acc, page) => acc + page.length, 0)

        return nextOffset
      },
    }
  )
}
