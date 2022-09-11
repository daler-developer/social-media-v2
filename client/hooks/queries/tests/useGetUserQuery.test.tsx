import apiClient from 'utils/apiClient'
import { fakeUser } from 'utils/fakeData'
import { customRenderHook } from 'utils/tests'
import useGetUserQuery from '../useGetUserQuery'
import * as usersApi from 'api/users'
import { RenderHookResult, waitFor } from '@testing-library/react'
import queryClient from 'utils/queryClient'
import useGetMeQuery from '../useGetMeQuery'

jest.mock('utils/apiClient')

describe('useGetUserQuery', () => {
  beforeEach(() => {
    ;(apiClient.get as jest.Mock).mockResolvedValue({
      data: { user: fakeUser },
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('correct api request is sent', () => {
    const getUserSpy = jest.spyOn(usersApi, 'getUser')

    customRenderHook(() => useGetUserQuery({ userId: 'userid002' }))

    expect(getUserSpy).toHaveBeenCalledTimes(1)
    expect(getUserSpy).toHaveBeenLastCalledWith({ userId: 'userid002' })
  })

  test('has correct data', async () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useGetMeQuery>,
      unknown
    > = customRenderHook(() => useGetUserQuery({ userId: 'userid002' }))

    await waitFor(() => expect(result.current.data).not.toBeUndefined())

    expect(result.current.data).toEqual(fakeUser)
  })
})
