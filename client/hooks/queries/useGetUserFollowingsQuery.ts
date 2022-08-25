import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import * as usersApi from '../../api/users'

export default ({ userId, search }: { userId: string; search?: string }) => {
  const query = useInfiniteQuery(
    ['users', userId, 'followings'],
    async ({ pageParam, queryKey }) => {
      const [, userId] = queryKey
      const { data } = await usersApi.getUserFollowings({
        userId,
        offset: pageParam,
        search,
      })

      return data
    },
    {
      getNextPageParam(_, pages) {
        const nextOffset = pages.reduce(
          (acc, page) => acc + page.users.length,
          0
        )

        return nextOffset
      },
    }
  )

  return query
}
