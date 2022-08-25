import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import * as usersApi from '../../api/users'

export default ({ postId }: { postId: string }) => {
  const query = useInfiniteQuery(
    ['posts', postId, 'likers'],
    async ({ pageParam }) => {
      const { data } = await usersApi.getPostLikers({
        postId,
        offset: pageParam,
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
