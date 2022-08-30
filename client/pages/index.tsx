import PostsList from '@/components/posts-list/PostsList'
import { useQueryClient } from '@tanstack/react-query'
import useGetFeedPostsQuery from 'hooks/queries/useGetFeedPostsQuery'
import { useEffect, useState } from 'react'
import { IPost } from 'utils/types'

const Home = () => {
  const [search, setSearch] = useState('')

  const postsQuery = useGetFeedPostsQuery({
    ...(search && { search }),
  })

  const allPosts = postsQuery.data?.pages.reduce(
    (acc, item) => [...acc, ...item],
    []
  )

  const handleFetchMore = () => {
    postsQuery.fetchNextPage()
  }

  const handleSearch = (v: string) => {
    setSearch(v)
  }

  return (
    <div>
      <div className='max-w-[500px] mx-auto'>
        <PostsList
          onSearch={handleSearch}
          posts={allPosts}
          isFetching={postsQuery.isFetching}
          onFetchMore={handleFetchMore}
        />
      </div>
    </div>
  )
}

export default Home
