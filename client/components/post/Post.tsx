import { Button, Dropdown, Typography } from 'antd'
import { IPost } from 'utils/types'
import NextImage from 'next/image'
import NextLink from 'next/link'
import {
  EllipsisOutlined as DotsIcon,
  HeartOutlined as HeartIcon,
  HeartFilled as HeartFilledIcon,
  CommentOutlined as CommentIcon,
} from '@ant-design/icons'
import PopupMenu from './popup-menu/PopupMenu'
import useIsAuthenticated from 'hooks/useIsAuthenticated'
import useLikePostMutation from 'hooks/mutations/useLikePostMutation'
import useUnlikePostMutation from 'hooks/mutations/useUnlikePostMutation'
import PostLikersPopup from './post-likers-popup/PostLikersPopup'
import { useEffect, useRef, useState } from 'react'
import CreateCommentForm from '../create-comment-form/CreateCommentForm'
import useTypedDispatch from 'hooks/useTypedDispatch'
import uiActions from '../../redux/slices/ui-slice/actions'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import { formatDate } from 'utils/helpers'
import MenuBtn from '../common/menu-btn/MenuBtn'
import Avatar from '../avatar/Avatar'
import useModals from 'hooks/useModals'

interface IProps {
  post: IPost
}

const Post = ({ post }: IProps) => {
  const [isPostLikersPopupOpen, setIsPostLikersPopupOpen] = useState(false)

  const likePostMutation = useLikePostMutation()
  const unLikePostMutation = useUnlikePostMutation()

  const isAuthenticated = useIsAuthenticated()

  const dispatch = useTypedDispatch()

  const modals = useModals()

  const commentInputRef = useRef<HTMLInputElement>(null!)

  const handleLikePost = () => {
    if (isAuthenticated) {
      likePostMutation.mutate({ postId: post._id })
    } else if (!isAuthenticated) {
      modals.openLoginModal()
    }
  }

  const handleUnlikePost = () => {
    unLikePostMutation.mutate({ postId: post._id })
  }

  const handleOpenComments = () => {
    modals.openCommentsModal()
    dispatch(uiActions.setPostCommentsParams({ postId: post._id }))
  }

  const handleCommentClick = () => {
    commentInputRef.current.focus()
  }

  const formatedDate = formatDate(post.createdAt)

  const shouldShowPopup = isAuthenticated && post.isCreatedByCurrentUser

  return (
    <div
      role='post'
      className='border border-solid bg-white border-gray-300 rounded-[4px]'
    >
      {/* Header */}
      <div className='p-[10px] flex items-center justify-between'>
        <NextLink href={`/users/${post.creator._id}`} passHref>
          <a className='flex items-center gap-[4px]'>
            <Avatar src={post.creator.avatarUrl} />
            <Typography.Text>{post.creator.username}</Typography.Text>
          </a>
        </NextLink>
        {shouldShowPopup && (
          <Dropdown
            data-testid='menu-popup'
            overlay={<PopupMenu post={post} />}
          >
            <MenuBtn />
          </Dropdown>
        )}
      </div>
      {/* Image */}
      <div className='w-full aspect-square relative'>
        <NextImage className='object-cover' src={post.imageUrl} layout='fill' />
      </div>
      {/* Body */}
      <div className='p-[10px]'>
        <Typography.Paragraph>{post.text}</Typography.Paragraph>

        <div className='flex items-center gap-[10px]'>
          {post.isLikedByCurrentUser ? (
            <Button
              key='unlikePostBtn'
              danger
              size='large'
              type='text'
              onClick={handleUnlikePost}
              icon={<HeartFilledIcon />}
              loading={unLikePostMutation.isLoading}
            />
          ) : (
            <Button
              key='likePostBtn'
              danger
              size='large'
              type='text'
              onClick={handleLikePost}
              icon={<HeartIcon />}
              loading={likePostMutation.isLoading}
            />
          )}
          <Button
            key='commmentPostBtn'
            icon={<CommentIcon />}
            size='large'
            type='text'
            onClick={handleCommentClick}
          />
        </div>
        <Dropdown
          onVisibleChange={(to) => setIsPostLikersPopupOpen(to)}
          overlay={
            <PostLikersPopup post={post} isOpen={isPostLikersPopupOpen} />
          }
        >
          <Typography.Text strong className='cursor-pointer'>
            Liked by {post.numLikes} users
          </Typography.Text>
        </Dropdown>
        <Button type='link' onClick={handleOpenComments}>
          See comments({post.numComments})
        </Button>
        <Typography.Paragraph type='secondary' className='text-[12px]'>
          Created: {formatedDate}
        </Typography.Paragraph>
      </div>
      {/* Footer */}
      <CreateCommentForm ref={commentInputRef} postId={post._id} />
    </div>
  )
}

export default Post
