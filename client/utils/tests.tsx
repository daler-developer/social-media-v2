import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../redux/store'
import queryClient from './queryClient'

const AllTheProviders = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
}

export const customRender = (ui: any, options?: object) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}
