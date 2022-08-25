import useGetFeedPostsQuery from 'hooks/queries/useGetFeedPostsQuery'
import useGetMeQuery from 'hooks/queries/useGetMeQuery'
import useGetUserFollowersQuery from 'hooks/queries/useGetUserFollowersQuery'
import useGetUserQuery from 'hooks/queries/useGetUserQuery'
import { useEffect, useState } from 'react'

const Home = () => {
  const userQuery = useGetUserQuery({ userId: '6304be478d6be4f7c8e6917b' })

  const [search, setSearch] = useState('')

  return (
    <div>
      {/* <input
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => followers.fetchNextPage()}>more</button> */}
    </div>
  )
}

export default Home
