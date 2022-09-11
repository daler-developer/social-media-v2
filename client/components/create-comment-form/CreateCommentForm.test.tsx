import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import apiClient from 'utils/apiClient'
import { customRender } from 'utils/tests'
import CreateCommentForm from './CreateCommentForm'
import * as commentsApi from '../../api/comments'
import queryClient from 'utils/queryClient'
import { IComment, IUser } from 'utils/types'
import { fakeComment, fakeUser } from 'utils/fakeData'
import LoginModal from '../login-modal/LoginModal'

jest.mock('../../utils/apiClient')

describe.skip('<CreateCommentForm />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render', () => {
    customRender(<CreateCommentForm postId='asdf' />)

    expect(screen.queryByTestId('create-comment-form')).toBeInTheDocument()
  })

  test('login modal should be opened when trying to create comment without authentication', async () => {
    const user = userEvent.setup()
    customRender(
      <>
        <CreateCommentForm postId='fakeid' />
        <LoginModal />
      </>
    )
    const createCommentSpy = jest.spyOn(commentsApi, 'createComment')

    await user.type(screen.getByPlaceholderText('Comment'), 'Hello World')
    await user.click(screen.getByText('Leave'))

    expect(createCommentSpy).toHaveBeenCalledTimes(0)
    expect(screen.queryByTestId('login-modal')).toBeVisible()
  })

  test('creating comment should succeed when authenticated', async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        comment: fakeComment,
      },
    })
    const user = userEvent.setup()
    customRender(<CreateCommentForm postId='fakeid' />)
    const createCommentSpy = jest.spyOn(commentsApi, 'createComment')

    queryClient.setQueriesData(['users', 'me'], fakeUser)

    await user.type(screen.getByPlaceholderText('Comment'), 'Hello World')
    await user.click(screen.getByText('Leave'))

    expect(createCommentSpy).toHaveBeenCalledTimes(1)
    expect(createCommentSpy).toHaveBeenLastCalledWith({
      postId: 'fakeid',
      text: 'Hello World',
    })
  })
})
