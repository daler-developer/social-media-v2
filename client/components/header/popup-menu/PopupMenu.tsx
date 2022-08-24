import { useQueryClient } from '@tanstack/react-query'
import { Menu } from 'antd'
import cn from 'classnames'
import useGetMeQuery from 'hooks/queries/useGetMeQuery'
import NextLink from 'next/link'
import { memo } from 'react'

const PopupMenu = memo(() => {
  const queryClient = useQueryClient()

  const getMeQuery = useGetMeQuery({ enabled: false })

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    window.location.reload()
  }

  return (
    <Menu
      items={[
        {
          key: 1,
          label: (
            <NextLink href={`/users/${getMeQuery.data!._id}`}>Profile</NextLink>
          ),
        },
        {
          key: 2,
          danger: true,
          label: <div onClick={handleLogout}>Logout</div>,
        },
      ]}
    />
  )
})

export default PopupMenu
