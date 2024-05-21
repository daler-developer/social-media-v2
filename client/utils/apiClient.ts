import axios from 'axios'

const apiClient = axios.create({})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers!['Authorization'] = 'Bearer ' + token
  }

  return config
})

export default apiClient
