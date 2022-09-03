import { Button } from 'antd'
import useFollowMutation from 'hooks/mutations/useFollowMutation'
import useUnfollowMutation from 'hooks/mutations/useUnfollowMutation'
import { IUser } from 'utils/types'
import NextLink from 'next/link'
import { FormEvent, MouseEvent, SyntheticEvent } from 'react'
import { UserOutlined } from '@ant-design/icons'
import Avatar from '../../avatar/Avatar'
import FollowBtn from '../../common/follow-btn/FollowBtn'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import UnfollowBtn from '../../common/unfollow-btn/UnfollowBtn'

interface IProps {
  user: IUser
}

const UserCard = ({ user }: IProps) => {
  const isAuthenticated = useIsAuthenticated()

  const shouldShowFollowAndUnfollowBtns = isAuthenticated && !user.isCurrentUser

  return (
    <NextLink href={`/users/${user._id}`} passHref>
      <div className='p-[20px] flex items-center justify-between cursor-pointer border border-solid bg-white border-gray-300 rounded-[4px]'>
        <div className='flex items-center gap-[15px]'>
          <Avatar size={30} src={user.avatarUrl} />
          {user.username}
        </div>
        {shouldShowFollowAndUnfollowBtns && (
          <div className=''>
            {user.currentUserFollows ? (
              <UnfollowBtn stopPropagation userId={user._id} />
            ) : (
              <FollowBtn stopPropagation userId={user._id} />
            )}
          </div>
        )}
      </div>
    </NextLink>
  )
}

export default UserCard
