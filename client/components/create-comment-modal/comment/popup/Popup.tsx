import { Button, Menu } from 'antd'
import useDeletePostCommentMutation from 'hooks/mutations/useDeletePostCommentMutation'
import { IComment } from 'utils/types'

interface IProps {
  comment: IComment
  onEditClick: () => void
}

const Popup = ({ comment, onEditClick }: IProps) => {
  const deleteCommentMutation = useDeletePostCommentMutation({
    comment,
  })

  const handleDelete = async () => {
    await deleteCommentMutation.mutateAsync()
  }

  return (
    <Menu
      items={[
        {
          key: 1,
          danger: true,
          label: <div onClick={handleDelete}>Delete</div>,
        },
        {
          key: 2,
          label: <div onClick={() => onEditClick()}>Edit</div>,
        },
      ]}
    />
  )
}

export default Popup
