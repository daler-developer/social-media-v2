import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum ModalsEnum {
  LOGIN,
  REGISTER,
  CREATE_POST,
  POST_COMMENTS,
  UPDATE_PROFILE,
}

interface IState {
  currentActiveModal: ModalsEnum | null
  modalsParams: {
    POST_COMMENTS_MODAL: {
      postId: string | null
    }
  }
}

const initialState: IState = {
  currentActiveModal: null,
  modalsParams: {
    POST_COMMENTS_MODAL: {
      postId: null,
    },
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    closedCurrentActiveModal(state) {
      state.currentActiveModal = null
    },
    changedCurrentActiveModal(state, { payload }: PayloadAction<ModalsEnum>) {
      state.currentActiveModal = payload
    },
    setPostCommentsParams(
      state,
      { payload }: PayloadAction<IState['modalsParams']['POST_COMMENTS_MODAL']>
    ) {
      state.modalsParams.POST_COMMENTS_MODAL = payload
    },
  },
})

export default uiSlice
