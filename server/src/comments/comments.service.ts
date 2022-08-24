import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CommentNotFoundException } from 'src/core/errors'
import { RequestService } from 'src/core/services/request.service'
import { IComment } from './schema/comment.schema'

const COMMENTS_LIMIT = 10

@Injectable()
export class CommentsService {
  constructor(private requestService: RequestService, @InjectModel('comment') private CommentModel: Model<IComment>) {}

  async getPostComments({ postId, offset = 0 }: { postId: Types.ObjectId; offset?: number }) {
    return await this.CommentModel.aggregate([
      {
        $match: {
          postId,
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'creatorId',
          as: 'creators',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                foreignField: 'followers_ids',
                localField: '_id',
                as: 'followings',
              },
            },
            {
              $lookup: {
                as: 'posts',
                from: 'posts',
                foreignField: 'creatorId',
                localField: '_id',
              },
            },
            {
              $addFields: {
                numFollowers: { $size: '$followers_ids' },
                numFollowings: { $size: '$followings' },
                numPosts: { $size: '$posts' },
                ...(this.requestService.isAuthenticated && {
                  currentUserFollows: {
                    $cond: {
                      if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                      then: '$$REMOVE',
                      else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
                    },
                  },
                  isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
                }),
              },
            },
          ],
        },
      },
      {
        $addFields: {
          creator: { $first: '$creators' },
          ...(this.requestService.isAuthenticated && {
            isCreatedByCurrentUser: { $eq: ['$creatorId', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $unset: [
          'creatorId',
          'creators',
          'creator.followers_ids',
          'creator.password',
          'creator.followings',
          'creator.posts',
        ],
      },
      {
        $skip: offset,
      },
      {
        $limit: COMMENTS_LIMIT,
      },
    ])
  }

  async getCommentByIdOrFailIfNotExists(_id: Types.ObjectId) {
    const [comment] = await this.CommentModel.aggregate([
      {
        $match: {
          _id,
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'creatorId',
          as: 'creators',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                foreignField: 'followers_ids',
                localField: '_id',
                as: 'followings',
              },
            },
            {
              $lookup: {
                as: 'posts',
                from: 'posts',
                foreignField: 'creatorId',
                localField: '_id',
              },
            },
            {
              $addFields: {
                numFollowers: { $size: '$followers_ids' },
                numFollowings: { $size: '$followings' },
                numPosts: { $size: '$posts' },
                ...(this.requestService.isAuthenticated && {
                  currentUserFollows: {
                    $cond: {
                      if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                      then: '$$REMOVE',
                      else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
                    },
                  },
                  isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
                }),
              },
            },
          ],
        },
      },
      {
        $addFields: {
          creator: { $first: '$creators' },
          ...(this.requestService.isAuthenticated && {
            isCreatedByCurrentUser: { $eq: ['$creatorId', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $unset: [
          'creatorId',
          'creators',
          'creator.followers_ids',
          'creator.password',
          'creator.followings',
          'creator.posts',
        ],
      },
    ])

    const doesNotExist = !comment

    if (doesNotExist) {
      throw new CommentNotFoundException()
    }

    return comment
  }

  async checkIfCommentIsCreatedByCurrentUser(commentId: Types.ObjectId) {
    return !!(await this.CommentModel.findOne({ _id: commentId, creatorId: this.requestService.currentUser._id }))
  }

  async checkIfCommentWithIdExists(commentId: Types.ObjectId) {
    return !!(await this.CommentModel.findById(commentId))
  }

  async createComment({ text, postId }: { text: string; postId: Types.ObjectId }) {
    const { _id } = await this.CommentModel.create({
      creatorId: this.requestService.currentUser._id,
      text,
      postId,
    })

    return await this.getCommentByIdOrFailIfNotExists(_id)
  }

  async deleteCommentOrFailIfNotFound(commentId: Types.ObjectId) {
    const doesNotExist = !(await this.checkIfCommentWithIdExists(commentId))

    if (doesNotExist) {
      throw new CommentNotFoundException()
    }

    await this.CommentModel.deleteOne({ _id: commentId })
  }

  async editComment({ text, commentId }: { commentId: Types.ObjectId; text: string }) {
    await this.CommentModel.updateOne({ _id: commentId }, { $set: { text } })

    return await this.getCommentByIdOrFailIfNotExists(commentId)
  }
}
