import type { AppProps } from 'next/app'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'antd/dist/antd.css'
import '@/styles/styles.css'
import queryClient from 'utils/queryClient'
import Layout from '@/components/common/layout/Layout'
import AppWrapper from '@/components/app/App'
import { Provider } from 'react-redux'
import store from 'redux/store'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  )
}

export default App
