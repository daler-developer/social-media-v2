import Avatar from '@/components/avatar/Avatar'
import FollowBtn from '@/components/common/follow-btn/FollowBtn'
import UnfollowBtn from '@/components/common/unfollow-btn/UnfollowBtn'
import FullScreenLoader from '@/components/full-screen-loader/FullScreenLoader'
import Followers from '@/components/user-profile/followers/Followers'
import Followings from '@/components/user-profile/followings/Followings'
import PostsUserCreated from '@/components/user-profile/posts/Posts'
import { Button, Tabs, Typography } from 'antd'
import useGetUserQuery from 'hooks/queries/useGetUserQuery'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import useParam from 'hooks/useParam'
import useTypedDispatch from 'hooks/useTypedDispatch'
import { useState } from 'react'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import uiActions from '../../redux/slices/ui-slice/actions'

const UserDetail = () => {
  const [tab, setTab] = useState('posts')

  const userId = useParam('_id')

  const userQuery = useGetUserQuery({ userId })

  const isAuthenticated = useIsAuthenticated()

  const dispatch = useTypedDispatch()

  const handleUpdateProfile = () => {
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.UPDATE_PROFILE))
  }

  if (userQuery.isFetching) {
    return <FullScreenLoader />
  }

  if (userQuery.isError) {
    return 'error'
  }

  if (userQuery.data) {
    const user = userQuery.data

    return (
      <div className='max-w-[500px] mx-auto'>
        {/* Stats */}
        <div className='flex items-center gap-[20px]'>
          <Avatar size={120} src={user.avatarUrl} />
          <div className='flex flex-col'>
            <div className='flex items-center gap-[10px]'>
              <Typography.Text strong className='text-[30px]'>
                {user.username}
              </Typography.Text>
              {user.isCurrentUser ? (
                <Button size='small' onClick={handleUpdateProfile}>
                  Update profile
                </Button>
              ) : (
                isAuthenticated &&
                (user.currentUserFollows ? (
                  <UnfollowBtn userId={userId} />
                ) : (
                  <FollowBtn userId={userId} />
                ))
              )}
            </div>
            {/* Stats */}
            <div className='mt-[10px] flex gap-[20px]'>
              <div className=''>
                <Typography.Text>{user.numFollowers} Followers</Typography.Text>
              </div>
              <div className=''>
                <Typography.Text>
                  {user.numFollowings} Followings
                </Typography.Text>
              </div>
              <div className=''>
                <Typography.Text>{user.numPosts} Posts</Typography.Text>
              </div>
            </div>
            {/* Full name */}
            <div className='mt-[10px]'>
              <Typography.Paragraph strong>
                {user.firstName} {user.lastName}
              </Typography.Paragraph>
            </div>
          </div>
        </div>
        {/* Bio */}
        {user.bio && (
          <Typography.Paragraph className='mt-[10px]'>
            {user.bio}
          </Typography.Paragraph>
        )}
        {/* Tabs */}
        <Tabs className='mt-[10px]' onChange={(key) => setTab(key)}>
          <Tabs.TabPane tab='Posts' key='posts'>
            <PostsUserCreated userId={userId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Followers' key='followers'>
            <Followers userId={userId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Followings' key='followings'>
            <Followings userId={userId} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default UserDetail
