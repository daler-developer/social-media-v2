import { Button, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { IPost } from 'utils/types'
import FetchMoreBtn from '../common/fetch-more-btn/FetchMoreBtn'
import Post from '../post/Post'

interface IProps {
  posts?: IPost[]
  isFetching: boolean
  onFetchMore: () => void
  onSearch: (value: string) => void
}

const PostsList = ({ posts, onSearch, isFetching, onFetchMore }: IProps) => {
  const hasPosts = posts && posts.length

  const showNoPostsText = !hasPosts && !isFetching

  return (
    <div>
      {/* Search */}
      <Input.Search placeholder='Search' onSearch={onSearch} />
      {/* No data */}
      {showNoPostsText && (
        <div className='text-center mt-[10px]'>
          <Typography.Text type='secondary'>No posts</Typography.Text>
        </div>
      )}
      {/* Posts */}
      {hasPosts ? (
        <div className='mt-[20px] flex flex-col gap-[20px]'>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
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

export default PostsList
