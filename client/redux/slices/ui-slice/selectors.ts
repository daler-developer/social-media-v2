import { IRootState } from 'redux/store'

export const selectCurrentActiveModal = (state: IRootState) => {
  return state.ui.currentActiveModal
}

export const selectPostCommentsParams = (state: IRootState) => {
  return state.ui.modalsParams.POST_COMMENTS_MODAL
}
