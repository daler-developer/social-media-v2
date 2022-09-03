import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import apiClient from '../../../utils/apiClient'
import { customRender } from 'utils/tests'
import FollowBtn from './FollowBtn'
import * as usersApi from '../../../api/users'

jest.mock('../../../utils/apiClient')

describe('<FollowBtn />', () => {
  test('should render', () => {
    customRender(<FollowBtn userId='fakeuserId' />)

    expect(screen.queryByRole('button')).toBeInTheDocument()
  })

  test('when clicking should follow user', async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        followed: true,
      },
    })

    const followUserSpy = jest.spyOn(usersApi, 'followUser')

    const user = userEvent.setup()
    customRender(<FollowBtn userId='fakeuserid' />)

    expect(followUserSpy).toBeCalledTimes(0)

    await user.click(screen.getByRole('button'))

    expect(followUserSpy).toBeCalledTimes(1)
    expect(followUserSpy).toHaveBeenCalledWith({ userId: 'fakeuserid' })
  })
})
