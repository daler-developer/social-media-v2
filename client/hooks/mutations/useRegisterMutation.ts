import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { AxiosErrorResponseType, IUser } from 'utils/types'
import * as authApi from '../../api/auth'

interface IData {
  user: IUser
  accessToken: string
  refreshToken: string
}

interface IParams {
  username: string
  firstName: string
  lastName: string
  password: string
}

export default () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<IData, AxiosErrorResponseType, IParams>(
    async (credentials) => {
      const { data } = await authApi.register(credentials)

      return data
    },
    {
      onSuccess(data) {
        localStorage.setItem('accessToken', data.accessToken)

        queryClient.setQueryData(['users', 'me'], data.user)
      },
    }
  )

  return mutation
}
