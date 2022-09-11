import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRender } from 'utils/tests'
import UnfollowBtn from './UnfollowBtn'
import apiClient from '../../../utils/apiClient'

jest.mock('../../../utils/apiClient')

describe('<UnfollowBtn />', () => {
  test('should render', () => {
    customRender(<UnfollowBtn userId='id001' stopPropagation={false} />)
  })

  test('stopPropagation true', async () => {
    const user = userEvent.setup()

    const handleClick = jest.fn()

    customRender(
      <div data-testid='wrapper' onClick={handleClick}>
        <UnfollowBtn userId='id001' stopPropagation={true} />
      </div>
    )

    await user.click(screen.getByText('Unfollow'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  test('stopPropagatoin false', async () => {
    const user = userEvent.setup()

    const handleClick = jest.fn()

    customRender(
      <div data-testid='wrapper' onClick={handleClick}>
        <UnfollowBtn userId='id001' stopPropagation={false} />
      </div>
    )

    await user.click(screen.getByText('Unfollow'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
