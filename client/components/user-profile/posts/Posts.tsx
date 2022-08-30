import PostsList from '@/components/posts-list/PostsList'
import useGetPostsUserCreated from 'hooks/queries/useGetPostsUserCreated'
import { useState } from 'react'

interface IProps {
  userId: string
}

const Posts = ({ userId }: IProps) => {
  const [search, setSearch] = useState('')

  const postsQuery = useGetPostsUserCreated({
    userId,
    ...(search && { search }),
  })

  const allPosts = postsQuery.data?.pages.reduce(
    (acc, item) => [...acc, ...item],
    []
  )

  return (
    <PostsList
      isFetching={postsQuery.isFetching}
      onFetchMore={() => postsQuery.fetchNextPage()}
      onSearch={(v) => setSearch(v)}
      posts={allPosts}
    />
  )
}

export default Posts
