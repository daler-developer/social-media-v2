import UsersList from '@/components/users-list/UsersList'
import useGetFollowingsQuery from 'hooks/queries/useGetFollowingsQuery'
import { useState } from 'react'

interface IProps {
  userId: string
}

const Followings = ({ userId }: IProps) => {
  const [search, setSearch] = useState('')

  const usersQuery = useGetFollowingsQuery({
    userId,
    ...(search && { search }),
  })

  const allUsers = usersQuery.data?.pages.reduce(
    (acc, item) => [...acc, ...item],
    []
  )
  return (
    <UsersList
      users={allUsers}
      isFetching={usersQuery.isFetching}
      onFetchMore={() => usersQuery.fetchNextPage()}
      onSearch={(v) => setSearch(v)}
    />
  )
}

export default Followings
