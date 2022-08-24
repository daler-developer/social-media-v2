import { Inject, Injectable, Scope, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Request } from 'express'
import { Model, Types } from 'mongoose'
import { AlreadyLikedPostException, ForbiddenToDeletePostException, NotLikedPostYetException } from 'src/core/errors'
import { RequestService } from 'src/core/services/request.service'
import { IPost } from './schemas/post.schema'

const POSTS_LIMIT = 10

@Injectable()
export class PostsService {
  constructor(private requestService: RequestService, @InjectModel('post') private PostModel: Model<IPost>) {}

  async getFeedPosts({ offset = 0, search }: { offset?: number; search?: string }) {
    const posts = await this.PostModel.aggregate([
      {
        $match: {
          ...(search && { text: { $regex: new RegExp(search, 'i') } }),
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'creators',
          localField: 'creatorId',
          foreignField: '_id',
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
        $lookup: {
          as: 'comments',
          from: 'comments',
          foreignField: 'postId',
          localField: '_id',
        },
      },
      {
        $addFields: {
          creator: { $first: '$creators' },
          numComments: { $size: '$comments' },
          numLikes: { $size: '$likes_ids' },
          ...(this.requestService.isAuthenticated && {
            isCreatedByCurrentUser: { $eq: ['$creatorId', this.requestService.currentUser._id] },
            isLikedByCurrentUser: { $in: [this.requestService.currentUser._id, '$likes_ids'] },
          }),
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: POSTS_LIMIT,
      },
      {
        $unset: [
          'likes_ids',
          'creatorId',
          'creators',
          'creator.followers_ids',
          'creator.password',
          'creator.followings',
          'creator.posts',
          'comments',
        ],
      },
    ])

    return posts
  }

  async getPostsUserCreated({
    userId,
    offset = 0,
    search,
  }: {
    userId: Types.ObjectId
    offset?: number
    search?: string
  }) {
    return await this.PostModel.aggregate([
      {
        $match: {
          creatorId: userId,
          ...(search && { text: { $regex: new RegExp(search, 'i') } }),
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'creators',
          localField: 'creatorId',
          foreignField: '_id',
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
        $lookup: {
          as: 'comments',
          from: 'comments',
          foreignField: 'postId',
          localField: '_id',
        },
      },
      {
        $addFields: {
          creator: { $first: '$creators' },
          numLikes: { $size: '$likes_ids' },
          numComments: { $size: '$comments' },
          ...(this.requestService.isAuthenticated && {
            isCreatedByCurrentUser: { $eq: ['$creatorId', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: POSTS_LIMIT,
      },
      {
        $unset: [
          'likes_ids',
          'creators',
          'creatorId',
          'creator.followers_ids',
          'creator.password',
          'creator.followings',
          'creator.posts',
          'comments',
        ],
      },
    ])
  }

  async getPostById(postId: Types.ObjectId) {
    const [post] = await this.PostModel.aggregate([
      {
        $match: {
          _id: postId,
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'creators',
          localField: 'creatorId',
          foreignField: '_id',
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
        $lookup: {
          as: 'comments',
          from: 'comments',
          foreignField: 'postId',
          localField: '_id',
        },
      },
      {
        $addFields: {
          creator: { $first: '$creators' },
          numLikes: { $size: '$likes_ids' },
          numComments: { $size: '$comments' },
          ...(this.requestService.isAuthenticated && {
            isCreatedByCurrentUser: { $eq: ['$creatorId', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $unset: [
          'likes_ids',
          'creatorId',
          'creators',
          'creator.followers_ids',
          'creator.password',
          'creator.followings',
          'creator.posts',
          'comments',
        ],
      },
    ])

    return post
  }

  async postWithIdExists(_id: Types.ObjectId) {
    return !!(await this.PostModel.findOne({ _id }))
  }

  async createPost({ filename, text }: { filename: string; text: string }) {
    const { _id } = await this.PostModel.create({
      creatorId: this.requestService.currentUser._id,
      text: text,
      imageUrl: this.generateImageUrl(filename),
    })

    return await this.getPostById(_id)
  }

  async checkIfCurrentUserLikedPost(postId: Types.ObjectId) {
    return !!(await this.PostModel.findOne({ _id: postId, likes_ids: { $all: [this.requestService.currentUser._id] } }))
  }

  async checkIfPostBelongsToCurrentUser(postId: Types.ObjectId) {
    return !!(await this.PostModel.findOne({ _id: postId, creatorId: this.requestService.currentUser._id }))
  }

  async likePostAndFailIfAlreadyLiked(postId: Types.ObjectId) {
    const alreadyLiked = await this.checkIfCurrentUserLikedPost(postId)

    if (alreadyLiked) {
      throw new AlreadyLikedPostException()
    }

    await this.PostModel.updateOne({ _id: postId }, { $push: { likes_ids: [this.requestService.currentUser._id] } })
  }

  async unlikePostAndFailIfNotLikedYet(postId: Types.ObjectId) {
    const notLikedYet = !(await this.checkIfCurrentUserLikedPost(postId))

    if (notLikedYet) {
      throw new NotLikedPostYetException()
    }

    await this.PostModel.updateOne({ _id: postId }, { $pull: { likes_ids: this.requestService.currentUser._id } })
  }

  async deletePost(postId: Types.ObjectId) {
    await this.PostModel.deleteOne({ _id: postId })
  }

  async deletePostAndFailIfForbidden(postId: Types.ObjectId) {
    const doesNotBelongToCurrentUser = !(await this.checkIfPostBelongsToCurrentUser(postId))

    if (doesNotBelongToCurrentUser) {
      throw new ForbiddenToDeletePostException()
    }

    await this.deletePost(postId)
  }

  generateImageUrl(filename: string) {
    return `/uploads/post-images/${filename}`
  }
}
