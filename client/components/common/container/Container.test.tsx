import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from 'utils/tests'
import Container from './Container'

describe('<Container />', () => {
  test('should render', () => {
    customRender(<Container>child</Container>)

    expect(screen.queryByRole('container')).toBeInTheDocument()
  })

  test('children should be rendered in the container', () => {
    customRender(<Container>child</Container>)

    expect(screen.queryByText('child')).toBeInTheDocument()
  })
})
