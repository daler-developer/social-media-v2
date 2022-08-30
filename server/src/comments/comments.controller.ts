import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { query } from 'express'
import { Types } from 'mongoose'
import { CommentsService } from 'src/comments/comments.service'
import { CommentNotFoundException, ForbiddenToDeleteCommentException, PostNotFoundException } from 'src/core/errors'
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard'
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe'
import { ValidationPipe } from 'src/core/pipes/validation.pipe'
import { PostsService } from 'src/posts/posts.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { EditCommentDto } from './dto/edit-comment.dto'
import { GetPostCommentsQueryDto } from './dto/get-post-comments-query.dto'

@Controller('/api')
export class CommentsController {
  constructor(private commentsService: CommentsService, private postsService: PostsService) {}

  @Get('/posts/:postId/comments')
  async getPostComments(
    @Query(ValidationPipe) query: GetPostCommentsQueryDto,
    @Param('postId', ParseObjectIdPipe) postId: Types.ObjectId
  ) {
    const comments = await this.commentsService.getPostComments({ postId, offset: query.offset })

    return { comments }
  }

  @Post('/posts/:postId/comments')
  @UseGuards(AuthRequiredGuard)
  async createComment(
    @Param('postId', ParseObjectIdPipe) postId: Types.ObjectId,
    @Body(ValidationPipe) body: CreateCommentDto
  ) {
    const postDoesNotExist = !(await this.postsService.postWithIdExists(postId))

    if (postDoesNotExist) {
      throw new PostNotFoundException()
    }

    const comment = await this.commentsService.createComment({ text: body.text, postId })

    return { comment }
  }

  @Delete('/comments/:commentId')
  @UseGuards(AuthRequiredGuard)
  async deleteComment(@Param('commentId', ParseObjectIdPipe) commentId: Types.ObjectId) {
    const forbiddenToDelete = !(await this.commentsService.checkIfCommentIsCreatedByCurrentUser(commentId))

    if (forbiddenToDelete) {
      throw new ForbiddenToDeleteCommentException()
    }

    await this.commentsService.deleteCommentOrFailIfNotFound(commentId)

    return { deleted: true }
  }

  @Patch('/comments/:commentId')
  @UseGuards(AuthRequiredGuard)
  async editComment(
    @Param('commentId', ParseObjectIdPipe) commentId: Types.ObjectId,
    @Body(ValidationPipe) body: EditCommentDto
  ) {
    const doesNotExist = !(await this.commentsService.checkIfCommentWithIdExists(commentId))

    if (doesNotExist) {
      throw new CommentNotFoundException()
    }

    const forbiddenToDelete = !(await this.commentsService.checkIfCommentIsCreatedByCurrentUser(commentId))

    if (forbiddenToDelete) {
      throw new ForbiddenToDeleteCommentException()
    }

    const editedComment = await this.commentsService.editComment({ commentId, text: body.text })

    return { comment: editedComment }
  }
}
