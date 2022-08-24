import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IPost, IUser } from 'utils/types'
import * as usersApi from '../../api/users'
import type { DataType as GetFeedPostsQueryDataType } from '../queries/useGetFeedPostsQuery'

export default ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosErrorResponseType>(
    async () => {
      await usersApi.unfollowUser({ userId })
    },
    {
      onSuccess() {
        queryClient.setQueriesData(
          ['users', 'detail', userId],
          (oldData?: IUser) => {
            if (oldData) {
              return {
                ...oldData,
                currentUserFollows: false,
              }
            }
          }
        )
        queryClient.setQueriesData(
          ['users', 'list'],
          (oldData?: InfiniteData<IUser[]>) => {
            if (oldData) {
              const newPages = oldData.pages.map((user) =>
                user.map((user) =>
                  user._id === userId
                    ? {
                        ...user,
                        currentUserFollows: false,
                      }
                    : user
                )
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
