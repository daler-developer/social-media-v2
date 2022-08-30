import { configureStore } from '@reduxjs/toolkit'
import uiSlice from './slices/ui-slice/uiSlice'

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
})

export type IRootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store
