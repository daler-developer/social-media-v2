import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import uiSlice from './slices/ui-slice/uiSlice'

export const setupStore = (preloadedState?: PreloadedState<IRootState>) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
  })
}

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
})

export type IRootState = ReturnType<typeof store.getState>
export type IAppStore = ReturnType<typeof setupStore>

export type AppDispatch = typeof store.dispatch

export default store
