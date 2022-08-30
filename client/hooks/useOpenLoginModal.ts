import useIsAuthenticated from './useIsAuthenticated'
import useTypedDispatch from './useTypedDispatch'
import uiActions from '../redux/slices/ui-slice/actions'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'

export default () => {
  const dispatch = useTypedDispatch()

  return () => {
    dispatch(uiActions.changedCurrentActiveModal(ModalsEnum.LOGIN))
  }
}
