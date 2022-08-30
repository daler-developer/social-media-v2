import { Button, Input, Modal, Typography } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import * as uiSelectors from '../../redux/slices/ui-slice/selectors'
import uiActions from '../../redux/slices/ui-slice/actions'
import useTypedSelector from 'hooks/useTypedSelector'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import useLoginMutation from 'hooks/mutations/useLoginMutation'
import { AxiosError } from 'axios'
import useTypedDispatch from 'hooks/useTypedDispatch'
import { FormEvent, useEffect, useRef } from 'react'
import NextImage from 'next/image'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import useCreatePostMutation from 'hooks/mutations/useCreatePostMutation'

interface IFormValues {
  text: string
  image: File
}

const validationSchema = yup.object({
  text: yup.string().required().min(3).max(100),
  image: yup.mixed().required(),
})

const EditPostModal = () => {
  const dispatch = useTypedDispatch()

  const form = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
  })

  return (
    <Modal
      title='Create post'
      visible={isVisible}
      onCancel={() => closeModal()}
      footer={[
        <Button
          key='login'
          htmlType='submit'
          loading={isSubmittingForm}
          onClick={form.handleSubmit(handleSubmit)}
        >
          Create
        </Button>,
        <Button key='cancel-btn' htmlType='button' onClick={() => closeModal()}>
          Cancel
        </Button>,
      ]}
    >
      <Controller
        name='text'
        control={form.control}
        render={({ field }) => (
          <Input
            className='mt-[10px]'
            placeholder='Text'
            {...(form.formState.errors.text && { status: 'error' })}
            {...field}
          />
        )}
      />
    </Modal>
  )
}

export default CreatePostModal
