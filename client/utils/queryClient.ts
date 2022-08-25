import { QueryClient } from '@tanstack/react-query'

export default new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 0,
      cacheTime: Infinity,
    },
  },
})
