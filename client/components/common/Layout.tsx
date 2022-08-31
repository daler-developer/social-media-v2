import cn from 'classnames'
import { ReactNode } from 'react'
import Header from '../header/Header'
import Container from './Container'
import LoginModal from '../login-modal/LoginModal'
import RegisterModal from '../register-modal/RegisterModal'
import CreatePostModal from '../create-post-modal/CreatePostModal'
import PostCommentsModal from '../create-comment-modal/PostCommentsModal'
import UpdateProfileModal from '../update-profile-modal/UpdateProfileModal'
import useIsAuthenticated from 'hooks/useIsAuthenticated'

interface IProps {
  children: ReactNode
}

const Layout = ({ children }: IProps) => {
  const isAuthenticated = useIsAuthenticated()

  return (
    <div className='min-h-screen py-[70px] bg-gray-50'>
      <Header />
      <Container>{children}</Container>
      <LoginModal />
      <RegisterModal />
      <PostCommentsModal />
      {isAuthenticated && (
        <>
          <CreatePostModal />
          <UpdateProfileModal />
        </>
      )}
    </div>
  )
}

export default Layout
