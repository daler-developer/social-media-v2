import { Button } from 'antd'
import useFollowMutation from 'hooks/mutations/useFollowMutation'
import useUnfollowMutation from 'hooks/mutations/useUnfollowMutation'
import { ComponentPropsWithRef, SyntheticEvent } from 'react'

interface IProps
  extends Omit<ComponentPropsWithRef<typeof Button>, 'onClick' | 'loading'> {
  userId: string
  stopPropagation?: boolean
}

const UnfollowBtn = ({ userId, stopPropagation = false }: IProps) => {
  const followMutation = useUnfollowMutation({ userId })

  const handleClick = async (e: SyntheticEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
    await followMutation.mutateAsync()
  }

  return (
    <Button loading={followMutation.isLoading} onClick={handleClick}>
      Unfollow
    </Button>
  )
}

export default UnfollowBtn
