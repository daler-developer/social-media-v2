import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import * as usersApi from '../../api/users'

export default ({ search }: { search?: string }) => {
  const query = useInfiniteQuery(
    ['posts', 'feed'],
    async ({ pageParam }) => {
      const { data } = await usersApi.getFeedUsers({
        offset: pageParam,
        search,
      })

      return data
    },
    {
      getNextPageParam(lastPage, pages) {
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
