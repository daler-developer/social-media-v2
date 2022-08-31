import { Button, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useCreateCommentMutation from 'hooks/mutations/useCreateCommentMutation'
import { forwardRef, RefObject, useEffect, useRef } from 'react'
import useTypedDispatch from 'hooks/useTypedDispatch'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import useOpenLoginModal from 'hooks/useOpenLoginModal'
import cn from 'classnames'

interface IProps {
  postId: string
  className?: string
}

interface IFormValues {
  text: string
}

const validationSchema = yup.object({
  text: yup.string().required().min(1).max(100),
})

const CreateCommentForm = forwardRef(
  ({ postId, className }: IProps, inputRef: any) => {
    const createCommentMutation = useCreateCommentMutation({ postId })

    const isAuthenticated = useIsAuthenticated()

    const openLoginModal = useOpenLoginModal()

    const form = useForm<IFormValues>({
      resolver: yupResolver(validationSchema),
    })

    const handleSubmit = async ({ text }: IFormValues) => {
      if (isAuthenticated) {
        await createCommentMutation.mutateAsync({ text })
      } else if (!isAuthenticated) {
        openLoginModal()
      }
      form.reset()
    }

    return (
      <form className='flex' onSubmit={form.handleSubmit(handleSubmit)}>
        <Controller
          name='text'
          control={form.control}
          render={({ field }) => {
            const { ref, ...rest } = field
            return (
              <Input
                className='flex-grow'
                placeholder='Comment'
                ref={(e) => {
                  ref(e)
                  if (inputRef) {
                    inputRef.current = e?.input
                  }
                }}
                {...(form.formState.errors.text && { status: 'error' })}
                {...rest}
              />
            )
          }}
        />
        <Button loading={createCommentMutation.isLoading} htmlType='submit'>
          Leave
        </Button>
      </form>
    )
  }
)

export default CreateCommentForm
