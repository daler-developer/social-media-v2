import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from 'utils/tests'
import FullScreenLoader from './FullScreenLoader'

describe('<FullScreenLoader />', () => {
  test('should render', () => {
    customRender(<FullScreenLoader />)

    expect(screen.queryByRole('screen-loader')).toBeInTheDocument()
  })
})
