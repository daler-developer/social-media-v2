import { Input, Spin, Typography } from 'antd'
import { IUser } from 'utils/types'
import FetchMoreBtn from '../common/fetch-more-btn/FetchMoreBtn'
import UserCard from './user-card/UserCard'

interface IProps {
  users?: IUser[]
  isFetching: boolean
  onFetchMore: () => void
  onSearch: (value: string) => void
}

const UsersList = ({ users, isFetching, onFetchMore, onSearch }: IProps) => {
  const hasUsers = users && users.length

  const showNoUsersText = !hasUsers && !isFetching

  return (
    <div>
      {/* Search */}
      <Input.Search placeholder='Search' onSearch={onSearch} />
      {/* No data */}
      {showNoUsersText && (
        <div className='text-center mt-[10px]'>
          <Typography.Text type='secondary'>No users</Typography.Text>
        </div>
      )}
      {/* Posts */}
      {hasUsers ? (
        <div className='mt-[20px] flex flex-col gap-[20px]'>
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : null}
      {/* Footer */}
      <div className='mt-[20px] text-center'>
        {isFetching ? (
          <Spin size='large' />
        ) : (
          <FetchMoreBtn onClick={() => onFetchMore()} />
        )}
      </div>
    </div>
  )
}

export default UsersList
