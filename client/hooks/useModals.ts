import useTypedDispatch from './useTypedDispatch'
import useTypedSelector from './useTypedSelector'
import * as uiSelectors from '../redux/slices/ui-slice/selectors'
import uiActions from '../redux/slices/ui-slice/actions'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'

export default () => {
  const dispatch = useTypedDispatch()

  const isLoginModalVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) === ModalsEnum.LOGIN
  const isRegisterModalVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) ===
    ModalsEnum.REGISTER
  const isCreatePostModalVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) ===
    ModalsEnum.CREATE_POST
  const isCommentsModalVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) ===
    ModalsEnum.POST_COMMENTS
  const isUpdateProfileModalVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) ===
    ModalsEnum.UPDATE_PROFILE

  const closeCurrentActiveModal = () =>
    dispatch(uiActions.closedCurrentActiveModal())
  const openLoginModal = () =>
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.LOGIN))
  const openRegisterModal = () =>
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.REGISTER))
  const openCreatePostModal = () =>
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.CREATE_POST))
  const openCommentsModal = () =>
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.POST_COMMENTS))
  const openUpdateProfileModal = () =>
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.UPDATE_PROFILE))

  return {
    isLoginModalVisible,
    isRegisterModalVisible,
    isCreatePostModalVisible,
    isCommentsModalVisible,
    isUpdateProfileModalVisible,
    closeCurrentActiveModal,
    openLoginModal,
    openRegisterModal,
    openCreatePostModal,
    openCommentsModal,
    openUpdateProfileModal,
  }
}
