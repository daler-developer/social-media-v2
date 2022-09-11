import { screen, render } from '@testing-library/react'
import { customRenderHook } from 'utils/tests'
import apiClient from '../../../utils/apiClient'
import * as usersApi from '../../../api/users'
import useFollowMutation from '../useFollowMutation'

jest.mock('../../../utils/apiClient')

describe('useFollowMutation', () => {
  test('api request should be sent when trying to mutate', async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValue({
      data: { followed: true },
    })
    const unfollowUserSpy = jest.spyOn(usersApi, 'followUser')

    const { result } = customRenderHook(() =>
      useFollowMutation({ userId: 'testid001' })
    )

    const current = result.current as ReturnType<typeof useFollowMutation>

    expect(unfollowUserSpy).toHaveBeenCalledTimes(0)

    await current.mutateAsync()

    expect(unfollowUserSpy).toHaveBeenCalledTimes(1)
    expect(unfollowUserSpy).toHaveBeenCalledWith({ userId: 'testid001' })
  })
})
