import { UploadOutlined as UploadIcon } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Input, Modal } from 'antd'
import useUpdateProfileMutation from 'hooks/mutations/useUpdateProfileMutation'
import useGetMeQuery from 'hooks/queries/useGetMeQuery'
import useModals from 'hooks/useModals'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import * as yup from 'yup'
import Avatar from '../avatar/Avatar'

interface IFormValues {
  username: string
  firstName: string
  lastName: string
  removeAvatar: boolean
  bio: string
  avatar?: File
}

const validationSchema = yup.object({
  username: yup.string().trim().required().min(3).max(20),
  firstName: yup.string().trim().required().min(1).max(20),
  lastName: yup.string().trim().required().min(1).max(20),
  bio: yup.string().trim().max(150),
  removeAvatar: yup.bool().required(),
  avatar: yup.mixed().optional(),
})

const UpdateProfileModal = () => {
  const updateProfileMutation = useUpdateProfileMutation()

  const fileInputRef = useRef<HTMLInputElement>(null!)

  const modals = useModals()

  const form = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
  })

  useWatch({ control: form.control, name: 'avatar' })
  useWatch({ control: form.control, name: 'removeAvatar' })

  const meQuery = useGetMeQuery({ enabled: false })

  const avatarUrl = form.getValues('avatar')
    ? URL.createObjectURL(form.getValues('avatar')!)
    : meQuery.data!.avatarUrl

  useEffect(() => {
    if (modals.isUpdateProfileModalVisible) {
      form.setValue('username', meQuery.data!.username)
      form.setValue('firstName', meQuery.data!.firstName)
      form.setValue('lastName', meQuery.data!.lastName)
      form.setValue('bio', meQuery.data!.bio)
      form.setValue('removeAvatar', false)
    }
  }, [modals.isUpdateProfileModalVisible])

  const getUpdatedProps = (values: IFormValues) => {
    const updatedProps: any = {}

    if (values.username !== meQuery.data!.username) {
      updatedProps.username = values.username
    }
    if (values.firstName !== meQuery.data!.firstName) {
      updatedProps.firstName = values.firstName
    }
    if (values.lastName !== meQuery.data!.lastName) {
      updatedProps.lastName = values.lastName
    }
    if (values.bio !== meQuery.data!.bio) {
      updatedProps.bio = values.bio
    }
    if (values.avatar) {
      updatedProps.avatar = values.avatar
    }
    updatedProps.removeAvatar = values.removeAvatar

    console.log(updatedProps)

    return updatedProps
  }

  const handleSubmit = async (values: IFormValues) => {
    console.log(values)
    await updateProfileMutation.mutateAsync(getUpdatedProps(values))
    modals.closeCurrentActiveModal()
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue('avatar', e.target.files![0])
  }

  const handleCancel = () => modals.closeCurrentActiveModal()

  return (
    <Modal
      title='Update profile'
      visible={modals.isUpdateProfileModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='login'
          htmlType='submit'
          loading={updateProfileMutation.isLoading}
          onClick={form.handleSubmit(handleSubmit)}
        >
          Update
        </Button>,
        <Button key='cancel-btn' htmlType='button' onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <div className='flex items-center justify-between'>
        <Avatar size={50} src={avatarUrl} />
        <Button
          onClick={() => fileInputRef.current.click()}
          size='small'
          icon={<UploadIcon />}
        >
          Upload
        </Button>
      </div>
      <div className='mt-[10px]'>
        <Controller
          name='removeAvatar'
          control={form.control}
          render={({ field }) => <Checkbox {...field}>Remove avatar</Checkbox>}
        />
      </div>
      <Controller
        name='username'
        control={form.control}
        render={({ field }) => (
          <Input
            className='mt-[10px]'
            placeholder='Username'
            {...(form.formState.errors.username && { status: 'error' })}
            {...field}
          />
        )}
      />
      <Controller
        name='firstName'
        control={form.control}
        render={({ field }) => (
          <Input
            className='mt-[10px]'
            placeholder='First name'
            {...(form.formState.errors.firstName && { status: 'error' })}
            {...field}
          />
        )}
      />
      <Controller
        name='lastName'
        control={form.control}
        render={({ field }) => (
          <Input
            className='mt-[10px]'
            placeholder='Last name'
            {...(form.formState.errors.lastName && { status: 'error' })}
            {...field}
          />
        )}
      />
      <Controller
        name='bio'
        control={form.control}
        render={({ field }) => (
          <Input.TextArea
            rows={4}
            className='mt-[10px]'
            placeholder='Bio'
            {...(form.formState.errors.bio && { status: 'error' })}
            {...field}
          />
        )}
      />
      <input
        hidden
        type='file'
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
    </Modal>
  )
}

export default UpdateProfileModal
