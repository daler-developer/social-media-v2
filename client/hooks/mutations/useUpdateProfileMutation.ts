import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosErrorResponseType, IComment, IPost, IUser } from 'utils/types'
import * as usersApi from '../../api/users'

interface IParams {
  firstName?: string
  lastName?: string
  username?: string
  removeAvatar: boolean
  avatar?: File
  bio?: string
}

type DataType = IUser

export default () => {
  const queryClient = useQueryClient()

  return useMutation<DataType, AxiosErrorResponseType, IParams>(
    async (params) => {
      const { data } = await usersApi.updateProfile(params)

      return data.user
    },
    {
      onSuccess(updatedUser) {
        queryClient.setQueriesData(['users', 'me'], (oldData?: IUser) => {
          if (oldData) {
            return updatedUser
          }
        })
        queryClient.setQueriesData(
          ['users', 'detail', updatedUser._id],
          (oldData?: IUser) => {
            if (oldData) {
              return updatedUser
            }
          }
        )
      },
    }
  )
}
