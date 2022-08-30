import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { AxiosErrorResponseType, IPost, IUser } from 'utils/types'
import * as postsApi from '../../api/posts'

interface IData {
  post: IPost
}

interface IParams {
  text: string
  image: File
}

export default () => {
  const mutation = useMutation<IData, AxiosErrorResponseType, IParams>(
    async (credentials) => {
      const { data } = await postsApi.createPost(credentials)

      return data
    }
  )

  return mutation
}
