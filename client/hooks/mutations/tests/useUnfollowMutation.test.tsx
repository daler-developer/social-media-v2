import { screen, render } from '@testing-library/react'
import { customRenderHook } from 'utils/tests'
import useUnfollowMutation from '../useUnfollowMutation'
import apiClient from '../../../utils/apiClient'
import * as usersApi from '../../../api/users'

jest.mock('../../../utils/apiClient')

describe('useUnfollowMutation', () => {
  test('api request should be sent when trying to mutate', async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValue({
      data: { unfollowed: true },
    })
    const unfollowUserSpy = jest.spyOn(usersApi, 'unfollowUser')

    const { result } = customRenderHook(() =>
      useUnfollowMutation({ userId: 'testid001' })
    )

    const current = result.current as ReturnType<typeof useUnfollowMutation>

    expect(unfollowUserSpy).toHaveBeenCalledTimes(0)

    await current.mutateAsync()

    expect(unfollowUserSpy).toHaveBeenCalledTimes(1)
    expect(unfollowUserSpy).toHaveBeenCalledWith({ userId: 'testid001' })
  })
})
