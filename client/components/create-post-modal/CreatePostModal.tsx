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
import useModals from 'hooks/useModals'

interface IFormValues {
  text: string
  image: File
}

const validationSchema = yup.object({
  text: yup.string().required().min(3).max(100),
  image: yup.mixed().required(),
})

const CreatePostModal = () => {
  const createPostMutation = useCreatePostMutation()

  const modals = useModals()

  const form = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
  })

  const fileInputRef = useRef<HTMLInputElement>(null!)

  useWatch({ control: form.control, name: 'image' })

  useEffect(() => {
    form.register('image')
  }, [])

  const handleSubmit = async (data: IFormValues) => {
    await createPostMutation.mutateAsync(data)

    closeAndResetModal()
  }

  const resetFileInput = () => {
    fileInputRef.current!.value = ''
  }

  const handleFileInputChange = (e: FormEvent<HTMLInputElement>) => {
    form.setValue('image', e.currentTarget.files![0])
  }

  const handleRemoveImage = () => {
    resetFileInput()
    form.resetField('image')
  }

  const handleCancel = () => closeAndResetModal()

  const closeAndResetModal = () => {
    modals.closeCurrentActiveModal()
    form.reset()
    resetFileInput()
  }

  const hasImageError = !!form.formState.errors.image
  const imageErrorMessage = form.formState.errors.image?.message
  const isSubmittingForm = form.formState.isSubmitting
  const hasUploadedImage = !!form.getValues('image')
  const uploadedImageUrl = hasUploadedImage
    ? URL.createObjectURL(form.getValues('image'))
    : null

  return (
    <Modal
      title='Create post'
      visible={modals.isCreatePostModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='login'
          htmlType='submit'
          loading={isSubmittingForm}
          onClick={form.handleSubmit(handleSubmit)}
        >
          Create
        </Button>,
        <Button key='cancel-btn' htmlType='button' onClick={handleCancel}>
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

      {hasUploadedImage ? (
        <>
          <div className='mt-[10px] relative w-full aspect-square'>
            <NextImage layout='fill' src={uploadedImageUrl!} />

            <Button
              htmlType='button'
              danger
              className='absolute top-[5px] right-[5px]'
              icon={<DeleteOutlined />}
              onClick={handleRemoveImage}
            />
          </div>
        </>
      ) : (
        <>
          {hasImageError && (
            <div className='mt-[10px]'>
              <Typography.Text type='danger'>
                {imageErrorMessage}
              </Typography.Text>
            </div>
          )}

          <Button
            block
            className='mt-[5px]'
            onClick={() => fileInputRef.current.click()}
            icon={<UploadOutlined />}
          >
            Upload image
          </Button>
        </>
      )}

      <input
        ref={fileInputRef}
        onChange={handleFileInputChange}
        type='file'
        hidden
      />
    </Modal>
  )
}

export default CreatePostModal
