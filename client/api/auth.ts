import client from 'utils/apiClient'
import { IUser } from 'utils/types'

export const register = async (dto: {
  username: string
  password: string
  firstName: string
  lastName: string
}) => {
  return await client.post<{
    user: IUser
    accessToken: string
  }>('/api/auth/register', dto)
}

export const login = async (dto: { username: string; password: string }) => {
  return await client.post<{
    user: IUser
    accessToken: string
  }>('/api/auth/login', dto)
}
