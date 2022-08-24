import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from 'utils/tests'
import Layout from './Layout'

describe('<Layout />', () => {
  test('should render', () => {
    customRender(<Layout>children</Layout>)

    expect(screen.queryByText('children')).toBeInTheDocument()
  })
})
