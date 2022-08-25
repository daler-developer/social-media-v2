import { useQuery } from '@tanstack/react-query'
import * as usersApi from '../../api/users'

export default ({ userId }: { userId: string }) => {
  const query = useQuery(['users', userId], async () => {
    const { data } = await usersApi.getUser({ userId })

    return data
  })

  return query
}
