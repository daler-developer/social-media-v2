import { HttpException, Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Model, ObjectId, Types } from 'mongoose'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'
import {
  AlreadyFollowingUserException,
  IncorrectPasswordException,
  NotFollowingUserYetException,
  PostNotFoundException,
  UserNotFoundException,
} from 'src/core/errors'
import { RequestService } from 'src/core/services/request.service'
import { IPost } from 'src/posts/schemas/post.schema'
import { Repository } from 'typeorm'
import { GetPostLikersQueryDto } from './dto/get-post-likers-query.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { IUser } from './schemas/user.schema'

const USERS_LIMIT = 10

@Injectable()
export class UsersService {
  constructor(
    private requestService: RequestService,
    @InjectModel('user') private UserModel: Model<IUser>,
    @InjectModel('post') private PostModel: Model<IPost>
  ) {}

  async getFeedUsers({ offset = 0, search }: { offset?: number; search?: string }) {
    const users = await this.UserModel.aggregate([
      {
        $match: {
          ...(search && { username: { $regex: new RegExp(search, 'i') } }),
        },
      },
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
          from: 'posts',
          foreignField: 'creatorId',
          localField: '_id',
          as: 'posts',
        },
      },
      {
        $addFields: {
          ...(this.requestService.isAuthenticated && {
            currentUserFollows: {
              $cond: {
                if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                then: null,
                else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
              },
            },
          }),
          numPosts: { $size: '$posts' },
          numFollowers: { $size: '$followers_ids' },
          numFollowings: { $size: '$followings' },
          ...(this.requestService.isAuthenticated
            ? {
                isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
              }
            : {
                isCurrentUser: null,
              }),
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: USERS_LIMIT,
      },
      {
        $unset: ['followers_ids', 'posts', 'password', 'followings'],
      },
    ])

    return users
  }

  async getUserById(_id: Types.ObjectId) {
    const [user] = await this.UserModel.aggregate([
      {
        $match: {
          _id,
        },
      },
      {
        $lookup: {
          from: 'posts',
          foreignField: 'creatorId',
          localField: '_id',
          as: 'posts',
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: 'followers_ids',
          localField: '_id',
          as: 'followings',
        },
      },
      {
        $addFields: {
          ...(this.requestService.isAuthenticated && {
            currentUserFollows: {
              $cond: {
                if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                then: '$$REMOVE',
                else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
              },
            },
          }),
          numFollowers: { $size: '$followers_ids' },
          numFollowings: { $size: '$followings' },
          numPosts: { $size: '$posts' },
          ...(this.requestService.isAuthenticated && {
            isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $unset: ['password', 'followers_ids', 'posts', 'followings'],
      },
    ])

    return user
  }

  async getPostLikersOrFailIfPostNotFound({ postId, offset = 0 }: GetPostLikersQueryDto & { postId: Types.ObjectId }) {
    const [post] = await this.PostModel.aggregate([
      {
        $match: {
          _id: postId,
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'likes_ids',
          as: 'likers',
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
                from: 'posts',
                foreignField: 'creatorId',
                localField: '_id',
                as: 'posts',
              },
            },
            {
              $addFields: {
                ...(this.requestService.isAuthenticated && {
                  currentUserFollows: {
                    $cond: {
                      if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                      then: null,
                      else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
                    },
                  },
                }),
                numFollowers: { $size: '$followers_ids' },
                numFollowings: { $size: '$followings' },
                numPosts: { $size: '$posts' },
                ...(this.requestService.isAuthenticated && {
                  isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
                }),
              },
            },
            {
              $unset: ['password', 'followers_ids', 'posts', 'followings'],
            },
            {
              $skip: offset,
            },
            {
              $limit: 10,
            },
          ],
        },
      },
    ])

    const postDoesNotExist = !post

    if (postDoesNotExist) {
      throw new PostNotFoundException()
    }

    return post.likers
  }

  async checkIfPasswordMatches({ password, userId }: { password: string; userId: Types.ObjectId }) {
    return await this.UserModel.exists({ _id: userId, password })
  }

  async checkIfPasswordMatchesOrFail({ password, userId }: { password: string; userId: Types.ObjectId }) {
    const matches = this.checkIfPasswordMatches({ userId, password })

    if (!matches) {
      throw new IncorrectPasswordException()
    }

    return true
  }

  async getUserByIdOrFailIfNotExists(_id: Types.ObjectId) {
    const user = await this.getUserById(_id)
    const doesNotExist = !user

    if (doesNotExist) {
      throw new UserNotFoundException()
    }

    return user
  }

  async getUserFollowers({ userId, offset = 0, search }: { userId: Types.ObjectId; offset?: number; search?: string }) {
    const currentUser = await this.UserModel.findById(userId)

    return await this.UserModel.aggregate([
      {
        $match: {
          _id: { $in: currentUser.followers_ids },
          ...(search && { username: { $regex: new RegExp(search, 'i') } }),
        },
      },
      {
        $lookup: {
          from: 'posts',
          foreignField: 'creatorId',
          localField: '_id',
          as: 'posts',
        },
      },
      {
        $addFields: {
          ...(this.requestService.isAuthenticated && {
            currentUserFollows: {
              $cond: {
                if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                then: null,
                else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
              },
            },
          }),
          numFollowers: { $size: '$followers_ids' },
          numFollowings: 0,
          numPosts: { $size: '$posts' },
          ...(this.requestService.isAuthenticated && {
            isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: USERS_LIMIT,
      },
      {
        $unset: ['followers_ids', 'posts', 'password'],
      },
    ])
  }

  async getUserFollowings({
    userId,
    offset = 0,
    search,
  }: {
    userId: Types.ObjectId
    offset?: number
    search?: string
  }) {
    return await this.UserModel.aggregate([
      {
        $match: {
          followers_ids: { $all: [userId] },
          ...(search && { username: { $regex: new RegExp(search, 'i') } }),
        },
      },
      {
        $lookup: {
          from: 'posts',
          foreignField: 'creatorId',
          localField: '_id',
          as: 'posts',
        },
      },
      {
        $addFields: {
          ...(this.requestService.isAuthenticated && {
            currentUserFollows: {
              $cond: {
                if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                then: null,
                else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
              },
            },
          }),
          numFollowers: { $size: '$followers_ids' },
          numFollowings: 0,
          numPosts: { $size: '$posts' },
          ...(this.requestService.isAuthenticated && {
            isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: USERS_LIMIT,
      },
      {
        $unset: ['followers_ids', 'posts', 'password'],
      },
    ])
  }

  private async checkIfCurrentUserFollowsUser(userId: Types.ObjectId) {
    const user = await this.UserModel.findOne({
      _id: userId,
      followers_ids: { $all: [this.requestService.currentUser._id] },
    })

    return !!user
  }

  async getUserByUsername(username: string) {
    const [user] = await this.UserModel.aggregate([
      {
        $match: {
          username,
        },
      },
      {
        $lookup: {
          from: 'posts',
          foreignField: 'creatorId',
          localField: '_id',
          as: 'posts',
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: 'followers_ids',
          localField: '_id',
          as: 'followings',
        },
      },
      {
        $addFields: {
          ...(this.requestService.isAuthenticated && {
            currentUserFollows: {
              $cond: {
                if: { $eq: [this.requestService.currentUser._id, '$_id'] },
                then: null,
                else: { $in: [this.requestService.currentUser._id, '$followers_ids'] },
              },
            },
          }),
          numFollowers: { $size: '$followers_ids' },
          numFollowings: { $size: '$followings' },
          numPosts: { $size: '$posts' },
          ...(this.requestService.isAuthenticated && {
            isCurrentUser: { $eq: ['$_id', this.requestService.currentUser._id] },
          }),
        },
      },
      {
        $unset: ['password', 'followers_ids', 'posts', 'followings'],
      },
    ])

    return user
  }

  async getUserByUsernameOrFailIfNotExists(username: string) {
    const user = await this.getUserByUsername(username)
    const doesNotExist = !user

    if (doesNotExist) {
      throw new UserNotFoundException()
    }

    return user
  }

  async userWithUsernameExists(username: string) {
    return !!(await this.getUserByUsername(username))
  }

  async userWithIdExists(_id: Types.ObjectId) {
    return !!(await this.UserModel.findById(_id))
  }

  async createUser(userDto: CreateUserDto) {
    const { _id } = await this.UserModel.create({
      username: userDto.username,
      password: userDto.password,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
    })

    return await this.getUserById(_id)
  }

  async followUser(userId: Types.ObjectId) {
    const alreadyFollows = await this.checkIfCurrentUserFollowsUser(userId)

    if (alreadyFollows) {
      throw new AlreadyFollowingUserException()
    }

    await this.UserModel.updateOne({ _id: userId }, { $push: { followers_ids: [this.requestService.currentUser._id] } })
  }

  async unfollowUser(userId: Types.ObjectId) {
    const notFollwingYet = !(await this.checkIfCurrentUserFollowsUser(userId))

    if (notFollwingYet) {
      throw new NotFollowingUserYetException()
    }

    await this.UserModel.updateOne({ _id: userId }, { $pull: { followers_ids: this.requestService.currentUser._id } })
  }

  async updateUserOrFailIfNotExists({
    userId,
    firstName,
    lastName,
    username,
    bio,
    removeAvatar = false,
    file,
  }: UpdateProfileDto & { userId: Types.ObjectId; file?: Express.Multer.File }) {
    const doesNotExist = !(await this.userWithIdExists(userId))

    if (doesNotExist) {
      throw new UserNotFoundException()
    }

    await this.UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(username && { username }),
          // bio might be empty string
          ...(typeof bio === 'string' && { bio }),
          ...(!removeAvatar && file && { avatarUrl: this.generateAvatarUrl(file.filename) }),
        },
        $unset: {
          ...(removeAvatar && { avatarUrl: true }),
        },
      }
    )

    return await this.getUserById(userId)
  }

  generateAvatarUrl(filename: string) {
    return `/uploads/avatars/${filename}`
  }
}
