import FetchMoreBtn from '@/components/common/fetch-more-btn/FetchMoreBtn'
import UserCard from '@/components/users-list/user-card/UserCard'
import UsersList from '@/components/users-list/UsersList'
import { Input, Spin } from 'antd'
import useGetFeedUsersQuery from 'hooks/queries/useGetFeedUsersQuery'
import { useState } from 'react'

interface IProps {}

const Users = ({}: IProps) => {
  const [search, setSearch] = useState('')

  const usersQuery = useGetFeedUsersQuery({ ...(search && { search }) })

  const allUsers = usersQuery.data?.pages.reduce(
    (acc, item) => [...acc, ...item],
    []
  )

  return (
    <div className='max-w-[700px] mx-auto'>
      <UsersList
        users={allUsers}
        isFetching={usersQuery.isFetching}
        onSearch={(v) => setSearch(v)}
        onFetchMore={() => usersQuery.fetchNextPage()}
      />
    </div>
  )
}

export default Users
