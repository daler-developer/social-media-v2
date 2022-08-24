import {
  screen,
  render,
  renderHook,
  act,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakeUser } from 'utils/fakeData'
import queryClient from 'utils/queryClient'
import { customRenderHook } from 'utils/tests'
import useIsAuthenticated from '../useIsAuthenticated'

describe('useIsAuthenticated', () => {
  test('should not be autenticated', async () => {
    const { result, queryClient } = customRenderHook(() => useIsAuthenticated())

    queryClient.resetQueries(['users', 'me'])

    await waitFor(() => expect(result.current).toBeFalsy())
  })

  test('should be authenticated', async () => {
    const { result, queryClient } = customRenderHook(() => useIsAuthenticated())

    queryClient.setQueryData(['users', 'me'], fakeUser)

    await waitFor(() => expect(result.current).toBeTruthy())
  })
})
