import { useQuery } from '@tanstack/react-query'
import { AxiosErrorResponseType, IUser } from 'utils/types'
import * as usersApi from '../../api/users'

export type DataType = IUser

export default ({ userId }: { userId: string }) => {
  const query = useQuery<DataType, AxiosErrorResponseType>(
    ['users', 'detail', userId],
    async () => {
      const { data } = await usersApi.getUser({ userId })

      return data.user
    }
  )

  return query
}
