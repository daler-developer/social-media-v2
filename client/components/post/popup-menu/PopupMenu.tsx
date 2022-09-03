import { Menu } from 'antd'
import useDeletePostMutation from 'hooks/mutations/useDeletePostMutation'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import { IPost } from 'utils/types'

interface IProps {
  post: IPost
}

const PopupMenu = ({ post }: IProps) => {
  const deletePostMutation = useDeletePostMutation()

  const handleDelete = () => {
    deletePostMutation.mutate({ postId: post._id })
  }

  const items: any[] = []

  if (post.isCreatedByCurrentUser) {
    items.push({
      key: 1,
      danger: true,
      label: <div onClick={handleDelete}>Delete</div>,
    })
  }

  return <Menu items={items} />
}

export default PopupMenu
