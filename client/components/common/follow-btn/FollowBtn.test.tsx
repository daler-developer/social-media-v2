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
})
