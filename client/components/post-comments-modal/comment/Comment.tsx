import { Dropdown, Typography } from 'antd'
import { IComment } from 'utils/types'
import { EllipsisOutlined as DotsIcon } from '@ant-design/icons'
import Popup from './popup/Popup'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import useDeletePostCommentMutation from 'hooks/mutations/useDeletePostCommentMutation'
import { useRef, useState } from 'react'
import EditForm from './edit-form/EditForm'
import { formatDate } from 'utils/helpers'
import NextLink from 'next/link'
import MenuBtn from 'components/common/menu-btn/MenuBtn'
import Avatar from 'components/avatar/Avatar'

interface IProps {
  comment: IComment
}

const Comment = ({ comment }: IProps) => {
  const [isEditingComment, setIsEditingComment] = useState(false)

  const isAuthenticated = useIsAuthenticated()

  const shouldShowPopup = isAuthenticated && comment.isCreatedByCurrentUser

  const handleEditClick = () => {
    setIsEditingComment(true)
  }

  const handleEditedComment = () => {
    setIsEditingComment(false)
  }

  const formatedDate = formatDate(comment.createdAt)

  return (
    <div className='flex items-center gap-[10px]'>
      <Avatar
        className='shrink-0 self-start'
        src={comment.creator.avatarUrl}
        size={30}
      />
      <div className='flex flex-col flex-grow'>
        <div>
          <NextLink href={`/users/${comment.creator._id}`} passHref>
            <Typography.Text strong>{comment.creator.username}</Typography.Text>
          </NextLink>
          <Typography.Text type='secondary' className='text-[10px]'>
            {' '}
            - {formatedDate}
          </Typography.Text>
        </div>
        {isEditingComment ? (
          <EditForm
            onHideForm={() => setIsEditingComment(false)}
            onEditedComment={handleEditedComment}
            comment={comment}
          />
        ) : (
          <Typography.Text>{comment.text}</Typography.Text>
        )}
      </div>
      {shouldShowPopup && (
        <Dropdown
          overlay={<Popup onEditClick={handleEditClick} comment={comment} />}
        >
          <MenuBtn />
        </Dropdown>
      )}
    </div>
  )
}

export default Comment
