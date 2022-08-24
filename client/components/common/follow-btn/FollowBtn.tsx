import { Button } from 'antd'
import useFollowMutation from 'hooks/mutations/useFollowMutation'
import { ComponentPropsWithRef, SyntheticEvent } from 'react'

interface IProps
  extends Omit<ComponentPropsWithRef<typeof Button>, 'onClick' | 'loading'> {
  userId: string
  stopPropagation?: boolean
}

const FollowBtn = ({ userId, stopPropagation = false }: IProps) => {
  const followMutation = useFollowMutation({ userId })

  const handleClick = async (e: SyntheticEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
    await followMutation.mutateAsync()
  }

  return (
    <Button loading={followMutation.isLoading} onClick={handleClick}>
      Follow
    </Button>
  )
}

export default FollowBtn
