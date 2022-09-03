import { Button, Input, Modal } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import * as uiSelectors from '../../redux/slices/ui-slice/selectors'
import uiActions from '../../redux/slices/ui-slice/actions'
import useTypedSelector from 'hooks/useTypedSelector'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import useLoginMutation from 'hooks/mutations/useLoginMutation'
import { AxiosError } from 'axios'
import useTypedDispatch from 'hooks/useTypedDispatch'
import { useEffect } from 'react'
import useRegisterMutation from 'hooks/mutations/useRegisterMutation'

interface IFormValues {
  username: string
  password: string
  firstName: string
  lastName: string
}

const validationSchema = yup.object({
  username: yup.string().required().min(3).max(20),
  firstName: yup.string().required().min(1).max(20),
  lastName: yup.string().required().min(1).max(20),
  password: yup.string().required().min(8).max(20),
})

const RegisterModal = () => {
  const loginMutation = useRegisterMutation()

  const dispatch = useTypedDispatch()

  const form = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
  })

  const isVisible =
    useTypedSelector(uiSelectors.selectCurrentActiveModal) ===
    ModalsEnum.REGISTER

  useEffect(() => {
    if (!isVisible) {
      form.reset()
    }
  }, [isVisible])

  const handleSubmit = async (data: IFormValues) => {
    await loginMutation.mutateAsync(data)

    closeModal()
  }

  const closeModal = () => {
    dispatch(uiActions.closedCurrentActiveModal())
  }

  return (
    <Modal
      title='Register'
      visible={isVisible}
      onCancel={() => closeModal()}
      footer={[
        <Button
          key='login'
          htmlType='submit'
          loading={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleSubmit)}
        >
          Register
        </Button>,
        <Button key='cancel-btn' htmlType='button' onClick={() => closeModal()}>
          Cancel
        </Button>,
      ]}
    >
      {loginMutation.error && (
        <div className='text-red-500 text-[14px]'>
          {loginMutation.error.response!.data.message}
        </div>
      )}
      <Controller
        name='username'
        control={form.control}
        render={({ field }) => (
          <Input
            className='mt-[10px]'
            placeholder='Username'
            {...(form.formState.errors.password && { status: 'error' })}
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
            {...(form.formState.errors.password && { status: 'error' })}
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
            {...(form.formState.errors.password && { status: 'error' })}
            {...field}
          />
        )}
      />
      <Controller
        name='password'
        control={form.control}
        render={({ field }) => (
          <Input
            className='mt-[10px]'
            placeholder='Password'
            type='password'
            {...(form.formState.errors.password && { status: 'error' })}
            {...field}
          />
        )}
      />
    </Modal>
  )
}

export default RegisterModal
