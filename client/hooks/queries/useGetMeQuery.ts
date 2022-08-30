import { useQuery } from '@tanstack/react-query'
import * as usersApi from '../../api/users'

export default ({ enabled }: { enabled: boolean }) => {
  const query = useQuery(
    ['users', 'me'],
    async () => {
      const { data } = await usersApi.getMe()

      return data.user
    },
    {
      enabled,
    }
  )

  return query
}
