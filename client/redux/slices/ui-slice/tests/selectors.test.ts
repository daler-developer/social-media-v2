import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupStore } from 'redux/store'
import * as selectors from '../selectors'
import uiActions from '../actions'
import { ModalsEnum } from '../uiSlice'

describe('Ui slice selectors', () => {
  test('selectCurrentActiveModal', () => {
    const store = setupStore()

    store.dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.CREATE_POST))

    expect(selectors.selectCurrentActiveModal(store.getState())).toEqual(
      ModalsEnum.CREATE_POST
    )
  })

  test('selectPostCommentsParams', () => {
    const store = setupStore()

    store.dispatch(uiActions.setPostCommentsParams({ postId: 'id001' }))

    expect(selectors.selectPostCommentsParams(store.getState())).toEqual({
      postId: 'id001',
    })
  })
})
