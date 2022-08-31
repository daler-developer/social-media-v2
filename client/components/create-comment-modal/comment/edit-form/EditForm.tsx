import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'antd'
import useEditPostCommentMutation from 'hooks/mutations/useEditPostCommentMutation'
import useClickOutside from 'hooks/useClickOutside'
import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IComment } from 'utils/types'
import * as yup from 'yup'

interface IProps {
  comment: IComment
  onEditedComment: () => void
  onHideForm: () => void
}

interface IFormValues {
  text: string
}

const validationSchema = yup.object({
  text: yup.string().required().min(1).max(100),
})

const EditForm = ({ comment, onEditedComment, onHideForm }: IProps) => {
  const editCommentMutation = useEditPostCommentMutation({
    commentId: comment._id,
  })

  useEffect(() => {
    form.setValue('text', comment.text)
  }, [comment.text])

  const form = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
  })

  const handleSubmit = async ({ text }: IFormValues) => {
    await editCommentMutation.mutateAsync({ text })

    onEditedComment()
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='border border-black'
    >
      <Controller
        name='text'
        control={form.control}
        render={({ field }) => {
          const { ref, onBlur, ...rest } = field
          return (
            <Input
              className='w-full'
              placeholder='Comment'
              ref={(e) => {
                ref(e)
                onBlur()
              }}
              onBlur={() => onHideForm()}
              {...(form.formState.errors.text && { status: 'error' })}
              {...rest}
            />
          )
        }}
      />
    </form>
  )
}

export default EditForm
