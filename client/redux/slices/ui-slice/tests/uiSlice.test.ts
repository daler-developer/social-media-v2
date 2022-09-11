import { setupStore } from 'redux/store'
import uiSlice, { ModalsEnum } from '../uiSlice'

describe('uiSlice', () => {
  describe('actions', () => {
    test('closedCurrentActiveModal action', () => {
      const store = setupStore()

      store.dispatch(
        uiSlice.actions.changedCurrentActiveModal(ModalsEnum.LOGIN)
      )
      store.dispatch(uiSlice.actions.closedCurrentActiveModal())

      expect(store.getState().ui.currentActiveModal).toBeNull()
    })

    test('changedCurrentActiveModal action', () => {
      const store = setupStore()

      store.dispatch(
        uiSlice.actions.changedCurrentActiveModal(ModalsEnum.CREATE_POST)
      )

      expect(store.getState().ui.currentActiveModal).toEqual(
        ModalsEnum.CREATE_POST
      )

      store.dispatch(
        uiSlice.actions.changedCurrentActiveModal(ModalsEnum.REGISTER)
      )

      expect(store.getState().ui.currentActiveModal).toEqual(
        ModalsEnum.REGISTER
      )
    })
  })
})
