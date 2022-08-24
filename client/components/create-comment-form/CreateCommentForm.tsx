import { Button, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useCreateCommentMutation from 'hooks/mutations/useCreateCommentMutation'
import { forwardRef, RefObject, useEffect, useRef } from 'react'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import cn from 'classnames'
import useModals from 'hooks/useModals'

interface IProps {
  postId: string
}

interface IFormValues {
  text: string
}

const validationSchema = yup.object({
  text: yup.string().required().min(1).max(100),
})

const CreateCommentForm = forwardRef(({ postId }: IProps, inputRef: any) => {
  const createCommentMutation = useCreateCommentMutation({ postId })

  const isAuthenticated = useIsAuthenticated()

  const modals = useModals()

  const form = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
  })

  const handleSubmit = async ({ text }: IFormValues) => {
    if (isAuthenticated) {
      await createCommentMutation.mutateAsync({ text })
    } else if (!isAuthenticated) {
      modals.openLoginModal()
    }
    form.reset()
  }

  return (
    <form
      className='flex'
      onSubmit={form.handleSubmit(handleSubmit)}
      data-testid='create-comment-form'
    >
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
})

export default CreateCommentForm
