import cn from 'classnames'
import useGetMeQuery from 'hooks/queries/useGetMeQuery'
import { ReactNode, useState } from 'react'
import FullScreenLoader from '../full-screen-loader/FullScreenLoader'

interface IProps {
  children: any
}

const App = ({ children }: IProps) => {
  const getMeQuery = useGetMeQuery({ enabled: true })

  const isFullScreenVisible = getMeQuery.isFetching

  if (isFullScreenVisible) {
    return <FullScreenLoader />
  }

  return children
}

export default App
