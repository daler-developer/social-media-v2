import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { customRenderHook } from 'utils/tests'
import useGetMeQuery from '../useGetMeQuery'
import * as usersApi from '../../../api/users'
import apiClient from 'utils/apiClient'
import { fakeUser } from 'utils/fakeData'

jest.mock('../../../utils/apiClient')

describe('useGetMeQuery', () => {
  beforeEach(() => {
    ;(apiClient.get as jest.Mock).mockResolvedValue({
      data: { user: fakeUser },
    })
  })

  test('when not enabled, request should not be sent', () => {
    const getMeSpy = jest.spyOn(usersApi, 'getMe')

    const { result } = customRenderHook(() => useGetMeQuery({ enabled: false }))

    expect(getMeSpy).not.toBeCalled()
  })

  test('when enabled, request should be sent', async () => {
    const getMeSpy = jest.spyOn(usersApi, 'getMe')

    const { result } = customRenderHook(() => useGetMeQuery({ enabled: true }))

    const current = result.current as ReturnType<typeof useGetMeQuery>

    expect(getMeSpy).toBeCalledTimes(1)
  })
})
