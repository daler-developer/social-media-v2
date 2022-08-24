import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from 'utils/tests'
import FetchMoreBtn from './FetchMoreBtn'

describe('<FetchMoreBtn />', () => {
  test('should render', () => {
    customRender(<FetchMoreBtn />)

    expect(screen.queryByRole('button')).toBeInTheDocument()
  })
})
