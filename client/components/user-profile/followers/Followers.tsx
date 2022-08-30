import UsersList from '@/components/users-list/UsersList'
import useGetFollowersQuery from 'hooks/queries/useGetFollowersQuery'
import { useState } from 'react'

interface IProps {
  userId: string
}

const Followers = ({ userId }: IProps) => {
  const [search, setSearch] = useState('')

  const usersQuery = useGetFollowersQuery({ userId, ...(search && { search }) })

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

export default Followers
