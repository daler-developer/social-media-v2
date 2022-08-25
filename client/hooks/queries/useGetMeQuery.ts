import { useQuery } from '@tanstack/react-query'
import * as usersApi from '../../api/users'

export default () => {
  const query = useQuery(['users', 'me'], async () => {
    const { data } = await usersApi.getMe()

    return data
  })

  return query
}
