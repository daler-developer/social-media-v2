import { PreloadedState } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook } from '@testing-library/react'
import { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { IAppStore, setupStore } from 'redux/store'
import { setupQueryClient } from './queryClient'

export const customRender = (
  ui: ReactElement,
  {
    store = setupStore(),
    queryClient = setupQueryClient(),
  }: { store?: IAppStore; queryClient?: QueryClient } = {}
) => {
  const Wrapper = ({ children }: any) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    )
  }

  return { ...render(ui, { wrapper: Wrapper }), queryClient, store }
}

export const customRenderHook = <T, V>(
  hook: any,
  {
    store = setupStore(),
    queryClient = setupQueryClient(),
  }: { store?: IAppStore; queryClient?: QueryClient } = {}
) => {
  const Wrapper = ({ children }: any) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    )
  }

  return { ...renderHook<T, V>(hook, { wrapper: Wrapper }), queryClient, store }
}
