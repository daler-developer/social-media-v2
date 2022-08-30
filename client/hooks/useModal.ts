import useTypedDispatch from './useTypedDispatch'
import useTypedSelector from './useTypedSelector'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import * as uiSelectors from '../redux/slices/ui-slice/selectors'
import uiActions from '../redux/slices/ui-slice/actions'

export default (type: ModalsEnum) => {
  const dispatch = useTypedDispatch()

  const isVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) === type

  const close = () => {
    dispatch(uiActions.closedCurrentActiveModal())
  }

  return {
    isVisible,
    close,
  }
}
