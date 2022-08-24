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
  password: string
}

export default () => {
  const mutation = useMutation<IData, AxiosErrorResponseType, IParams>(
    async (credentials) => {
      const { data } = await authApi.login(credentials)

      return data
    },
    {
      onSuccess(data) {
        localStorage.setItem('accessToken', data.accessToken)

        window.location.reload()
      },
    }
  )

  return mutation
}
