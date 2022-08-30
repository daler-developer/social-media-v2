import cn from 'classnames'
import { Button, Dropdown, Typography } from 'antd'
import useGetMeQuery from 'hooks/queries/useGetMeQuery'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import Container from '../common/Container'
import PopupMenu from './popup-menu/PopupMenu'
import useTypedDispatch from 'hooks/useTypedDispatch'
import uiActions from '../../redux/slices/ui-slice/actions'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import useOpenLoginModal from 'hooks/useOpenLoginModal'
import NextLink from 'next/link'
import Avatar from '../avatar/Avatar'

interface IProps {}

const Header = ({}: IProps) => {
  const isAuthenticated = useIsAuthenticated()

  const dispatch = useTypedDispatch()

  const openLoginModal = useOpenLoginModal()

  const getMeQuery = useGetMeQuery({ enabled: false })

  const handleNewPost = () => {
    if (isAuthenticated) {
      dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.CREATE_POST))
    } else if (!isAuthenticated) {
      openLoginModal()
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full shadow-lg z-40 bg-white'>
      <Container>
        <div className='h-[50px] flex items-center justify-between'>
          {/* Left */}
          {isAuthenticated ? (
            <>
              <div className='flex items-center gap-[5px]'>
                <Dropdown overlay={<PopupMenu />}>
                  <Avatar src={getMeQuery.data!.avatarUrl} />
                </Dropdown>
                <div className='text-[22px]'>{getMeQuery.data!.username}</div>
              </div>
            </>
          ) : (
            <div className='flex items-center gap-[5px]'>
              <Button
                type='primary'
                ghost
                onClick={() =>
                  dispatch(
                    uiActions.changedCurrentActiveModal(ModalsEnum.LOGIN)
                  )
                }
              >
                Login
              </Button>
              <Button
                type='primary'
                ghost
                onClick={() =>
                  dispatch(
                    uiActions.changedCurrentActiveModal(ModalsEnum.REGISTER)
                  )
                }
              >
                Register
              </Button>
            </div>
          )}
          {/* Middle */}
          <div className='flex items-center gap-[20px]'>
            <NextLink href='/' passHref>
              <Typography.Link>Home</Typography.Link>
            </NextLink>
            <NextLink href='/users' passHref>
              <Typography.Link>Users</Typography.Link>
            </NextLink>
          </div>

          {/* Right */}
          <div className=''>
            <Button type='primary' shape='round' onClick={handleNewPost}>
              New Post
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Header
