import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakePost, fakeUser } from 'utils/fakeData'
import { customRender } from 'utils/tests'
import Post from './Post'
import { setupStore } from 'redux/store'
import uiActions from 'redux/slices/ui-slice/actions'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'

describe('<Post />', () => {
  test('should render', () => {
    customRender(<Post post={fakePost} />)

    expect(screen.queryByRole('post')).toBeInTheDocument()
  })

  test('num comments is displayed', () => {
    customRender(<Post post={fakePost} />)

    expect(
      screen.queryByText(`See comments(${fakePost.numComments})`)
    ).toBeInTheDocument()
  })

  test('post text is displayed', () => {
    customRender(<Post post={fakePost} />)

    expect(screen.queryByText(fakePost.text)).toBeInTheDocument()
  })

  test('num likes is displayed', () => {
    customRender(<Post post={fakePost} />)

    expect(
      screen.queryByText(`Liked by ${fakePost.numLikes} users`)
    ).toBeInTheDocument()
  })

  test('comments modal', async () => {
    const user = userEvent.setup()
    const store = setupStore()
    store.dispatch(uiActions.closedCurrentActiveModal())

    customRender(
      <>
        <Post post={fakePost} />
      </>,
      {
        store,
      }
    )

    await user.click(screen.getByText(`See comments(${fakePost.numComments})`))

    expect(store.getState().ui.currentActiveModal).toEqual(
      ModalsEnum.POST_COMMENTS
    )
  })

  test('created date is displayed', () => {
    customRender(<Post post={fakePost} />)

    expect(screen.queryByText('Created: 2022-08-29')).toBeInTheDocument()
  })

  test('menu popup should be hidden when not authenticated or post does not belong to current user', () => {
    const { queryClient, rerender } = customRender(
      <Post post={{ ...fakePost, isCreatedByCurrentUser: false }} />
    )

    act(() => {
      queryClient.resetQueries(['users', 'me'])
    })

    expect(screen.queryByTestId('menu-popup')).not.toBeInTheDocument()

    rerender(<Post post={{ ...fakePost, isCreatedByCurrentUser: false }} />)
    act(() => {
      queryClient.setQueryData(['users', 'me'], fakeUser)
    })

    expect(screen.queryByTestId('menu-popup')).not.toBeInTheDocument()
  })

  test.skip('menu popup should be visible when authenticated and post belongs to currentUser', () => {
    const { queryClient } = customRender(
      <Post post={{ ...fakePost, isCreatedByCurrentUser: true }} />
    )

    act(() => {
      queryClient.setQueryData(['users', 'me'], fakeUser)
    })

    expect(screen.queryByTestId('menu-popup')).toBeInTheDocument()
  })
})
