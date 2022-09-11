import { QueryClient } from '@tanstack/react-query'

export const setupQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
      },
    },
  })
}

export default new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    },
  },
})
