import {
  screen,
  render,
  renderHook,
  RenderHookResult,
  act,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import store from 'redux/store'
import { customRenderHook } from 'utils/tests'
import useModals from '../useModals'
import uiActions from '../../redux/slices/ui-slice/actions'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'

describe('useModals', () => {
  test('all modals should be hidden', () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useModals>,
      unknown
    > = customRenderHook(() => useModals())

    act(() => {
      result.current.closeCurrentActiveModal()
    })

    expect(result.current.isCommentsModalVisible).toBeFalsy()
    expect(result.current.isCreatePostModalVisible).toBeFalsy()
    expect(result.current.isUpdateProfileModalVisible).toBeFalsy()
    expect(result.current.isRegisterModalVisible).toBeFalsy()
    expect(result.current.isLoginModalVisible).toBeFalsy()
  })

  test('only login modal should be visible', () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useModals>,
      unknown
    > = customRenderHook(() => useModals())

    act(() => {
      result.current.openLoginModal()
    })

    expect(result.current.isLoginModalVisible).toBeTruthy()
    expect(result.current.isRegisterModalVisible).toBeFalsy()
    expect(result.current.isCreatePostModalVisible).toBeFalsy()
    expect(result.current.isUpdateProfileModalVisible).toBeFalsy()
    expect(result.current.isCommentsModalVisible).toBeFalsy()
  })

  test('only register modal should be visible', () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useModals>,
      unknown
    > = customRenderHook(() => useModals())

    act(() => {
      result.current.openRegisterModal()
    })

    expect(result.current.isRegisterModalVisible).toBeTruthy()
    expect(result.current.isLoginModalVisible).toBeFalsy()
    expect(result.current.isCreatePostModalVisible).toBeFalsy()
    expect(result.current.isUpdateProfileModalVisible).toBeFalsy()
    expect(result.current.isCommentsModalVisible).toBeFalsy()
  })

  test('update profile modal should be visible', () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useModals>,
      unknown
    > = customRenderHook(() => useModals())

    act(() => {
      result.current.openUpdateProfileModal()
    })

    expect(result.current.isUpdateProfileModalVisible).toBeTruthy()
    expect(result.current.isLoginModalVisible).toBeFalsy()
    expect(result.current.isCreatePostModalVisible).toBeFalsy()
    expect(result.current.isCommentsModalVisible).toBeFalsy()
    expect(result.current.isRegisterModalVisible).toBeFalsy()
  })

  test('comments modal should be visible', () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useModals>,
      unknown
    > = customRenderHook(() => useModals())

    act(() => {
      result.current.openCommentsModal()
    })

    expect(result.current.isCommentsModalVisible).toBeTruthy()
    expect(result.current.isLoginModalVisible).toBeFalsy()
    expect(result.current.isCreatePostModalVisible).toBeFalsy()
    expect(result.current.isUpdateProfileModalVisible).toBeFalsy()
    expect(result.current.isRegisterModalVisible).toBeFalsy()
  })

  test('create post modal should be visible', () => {
    const {
      result,
    }: RenderHookResult<
      ReturnType<typeof useModals>,
      unknown
    > = customRenderHook(() => useModals())

    act(() => {
      result.current.openCreatePostModal()
    })

    expect(result.current.isCreatePostModalVisible).toBeTruthy()
    expect(result.current.isLoginModalVisible).toBeFalsy()
    expect(result.current.isUpdateProfileModalVisible).toBeFalsy()
    expect(result.current.isCommentsModalVisible).toBeFalsy()
    expect(result.current.isRegisterModalVisible).toBeFalsy()
  })
})
