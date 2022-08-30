import { PlusOutlined as PlusIcon } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Modal, Spin, Typography } from 'antd'
import useGetPostCommentsQuery from 'hooks/queries/useGetPostCommentsQuery'
import useModal from 'hooks/useModal'
import useTypedSelector from 'hooks/useTypedSelector'
import { useEffect } from 'react'
import { ModalsEnum } from 'redux/slices/ui-slice/uiSlice'
import * as uiSelectors from '../../redux/slices/ui-slice/selectors'
import FetchMoreBtn from '../common/fetch-more-btn/FetchMoreBtn'
import CreateCommentForm from '../create-comment-form/CreateCommentForm'
import Comment from './comment/Comment'

const CreateCommentModal = () => {
  const modal = useModal(ModalsEnum.POST_COMMENTS)

  const queryClient = useQueryClient()

  const params = useTypedSelector(uiSelectors.selectPostCommentsParams)

  const commentsQuery = useGetPostCommentsQuery({
    postId: params.postId as string,
    enabled: !!params.postId,
  })

  // useEffect(() => {
  //   if (!modal.isVisible && params.postId) {
  //     queryClient.resetQueries(['comments', 'list', { postId: params.postId }])
  //   }
  // }, [modal.isVisible, params.postId])

  const allComments = commentsQuery.data?.pages.reduce(
    (acc, item) => [...acc, ...item],
    []
  )

  const hasComments = allComments && allComments.length
  const showNotCommentsText = !hasComments && !commentsQuery.isFetching

  return (
    <Modal
      title='Comments'
      onCancel={() => modal.close()}
      visible={modal.isVisible}
      footer={null}
    >
      {params.postId && (
        <div className='h-[400px] flex flex-col gap-[10px]'>
          {/* body */}
          <div className='flex-grow overflow-auto'>
            {showNotCommentsText && (
              <Typography.Paragraph className='text-center' type='secondary'>
                No comments
              </Typography.Paragraph>
            )}
            {allComments && (
              <div className='flex flex-col gap-[10px]'>
                {allComments.map((comment) => (
                  <Comment comment={comment} />
                ))}
              </div>
            )}

            <div className='flex items-center justify-center h-[50px]'>
              {commentsQuery.isFetching ? (
                <Spin />
              ) : commentsQuery.isError ? (
                commentsQuery.isError && <span>error</span>
              ) : (
                <FetchMoreBtn onClick={() => commentsQuery.fetchNextPage()} />
              )}
            </div>
          </div>
          {/* footer */}
          <CreateCommentForm postId={params.postId} />
        </div>
      )}
    </Modal>
  )
}

export default CreateCommentModal
