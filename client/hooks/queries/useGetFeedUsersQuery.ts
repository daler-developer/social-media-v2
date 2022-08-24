import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost, IUser } from 'utils/types'
import * as usersApi from '../../api/users'

export type DataType = IUser[]

export default ({ search }: { search?: string }) => {
  return useInfiniteQuery<DataType, AxiosErrorResponseType>(
    ['users', 'list', 'feed', { search }],
    async ({ pageParam }) => {
      const { data } = await usersApi.getFeedUsers({
        offset: pageParam,
        search,
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
