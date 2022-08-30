import { Button, Spin, Typography } from 'antd'
import useGetPostLikersQuery from 'hooks/queries/useGetPostLikersQuery'
import { memo, useEffect } from 'react'
import { IPost } from 'utils/types'
import NextLink from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import FetchMoreBtn from '@/components/common/fetch-more-btn/FetchMoreBtn'

interface IProps {
  isOpen: boolean
  post: IPost
}

const PostLikersPopup = ({ isOpen, post }: IProps) => {
  const usersQuery = useGetPostLikersQuery({ postId: post._id, enabled: false })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (isOpen) {
      usersQuery.refetch()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      queryClient.resetQueries([
        'users',
        'list',
        'likers',
        { postId: post._id },
      ])
    }
  }, [isOpen])

  const allUsers = usersQuery.data?.pages.reduce(
    (acc, item) => [...acc, ...item],
    []
  )

  const hasUsers = allUsers && allUsers.length
  const showNotUsersText = !hasUsers && !usersQuery.isFetching

  return (
    <div className='bg-white border border-solid border-black min-h-[40px]'>
      {showNotUsersText && (
        <div className='text-center'>
          <Typography.Text type='secondary'>No likers</Typography.Text>
        </div>
      )}
      {allUsers &&
        allUsers.map((user) => (
          <NextLink href={`/users/${user._id}`} passHref>
            <div className='p-[3px]'>
              <Typography.Text>
                {user.firstName} {user.lastName}
              </Typography.Text>
            </div>
          </NextLink>
        ))}
      <div className='text-center'>
        {usersQuery.isFetching ? (
          <Spin size='small' />
        ) : (
          <FetchMoreBtn
            onClick={() => usersQuery.fetchNextPage()}
            size='small'
          />
        )}
      </div>
    </div>
  )
}

export default PostLikersPopup
