import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakePost } from 'utils/fakeData'
import { customRender } from 'utils/tests'
import PopupMenu from './PopupMenu'

describe('<PopupMenu />', () => {
  test('should render', () => {
    customRender(<PopupMenu post={fakePost} />)

    expect(screen.queryByRole('menu')).toBeInTheDocument()
  })
})
