import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { ObjectId, Types } from 'mongoose'
import { GetUsersQueryDto } from './dto/get-users-query.dto'
import { User } from 'src/core/decorators/user.decorator'
import { UserNotFoundException } from 'src/core/errors'
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard'
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe'
import { IUser } from './schemas/user.schema'
import { UsersService } from './users.service'
import { ValidationPipe } from 'src/core/pipes/validation.pipe'
import { GetUsersFollowingsQueryDto } from './dto/get-user-followings.dto'
import { GetUserFollowersQueryDto } from './dto/get-user-followers.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { avatarsStorage } from './avatars.storage'
import { RequestService } from 'src/core/services/request.service'
import { GetPostLikersQueryDto } from './dto/get-post-likers-query.dto'
import { GetUserFollowersParamsDto } from './dto/get-user-followers-params.dto'

@Controller('/api')
export class UsersController {
  constructor(private usersService: UsersService, private requestService: RequestService) {}

  @Get('/feed/users')
  async getFeedUsers(@Query(ValidationPipe) query: GetUsersQueryDto) {
    const users = await this.usersService.getFeedUsers({ offset: query.offset, search: query.search })

    return { users }
  }

  @Get('/users/me')
  @UseGuards(AuthRequiredGuard)
  async getMe(@User() user: IUser) {
    return { user }
  }

  @Get('/users/:_id')
  async getUser(@Param('_id', ParseObjectIdPipe) _id: Types.ObjectId) {
    const user = await this.usersService.getUserByIdOrFailIfNotExists(_id)

    return { user }
  }

  @Patch('/users/:_id/follow')
  @UseGuards(AuthRequiredGuard)
  async followUser(@User() user: object, @Param('_id', ParseObjectIdPipe) userId: Types.ObjectId) {
    await this.usersService.followUser(new Types.ObjectId(userId))

    return { followed: true }
  }

  @Patch('/users/:_id/unfollow')
  @UseGuards(AuthRequiredGuard)
  async unfollowUser(@Param('_id', ParseObjectIdPipe) userId: Types.ObjectId) {
    await this.usersService.unfollowUser(new Types.ObjectId(userId))

    return { unfollowed: true }
  }

  @Get('/users/:userId/followers')
  async getUserFollowers(
    @Param(ValidationPipe) params: GetUserFollowersParamsDto,
    @Query(ValidationPipe) query: GetUserFollowersQueryDto
  ) {
    const userId = new Types.ObjectId(params.userId)

    const doesNotExist = !(await this.usersService.userWithIdExists(userId))

    if (doesNotExist) {
      throw new UserNotFoundException()
    }

    const users = await this.usersService.getUserFollowers({
      userId: userId,
      offset: query.offset,
      search: query.search,
    })

    return {
      users,
    }
  }

  @Get('/users/:_id/followings')
  @UseGuards(AuthRequiredGuard)
  async getUserFollowings(
    @Param('_id', ParseObjectIdPipe) userId: Types.ObjectId,
    @Query(ValidationPipe) query: GetUsersFollowingsQueryDto
  ) {
    const doesNotExist = !(await this.usersService.userWithIdExists(userId))

    if (doesNotExist) {
      throw new UserNotFoundException()
    }

    const users = await this.usersService.getUserFollowings({ userId, offset: query.offset, search: query.search })

    return {
      users,
    }
  }

  @Patch('/users/me/update-profile')
  @UseGuards(AuthRequiredGuard)
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarsStorage }))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
    @Body(ValidationPipe) body: UpdateProfileDto
  ) {
    const updatedUser = await this.usersService.updateUserOrFailIfNotExists({ userId: user._id, ...body, file })

    return { user: updatedUser }
  }

  @Get('/posts/:postId/likers')
  async getUsersWhoLikedSpecificPost(
    @Query(ValidationPipe) query: GetPostLikersQueryDto,
    @Param('postId', ParseObjectIdPipe) postId: Types.ObjectId
  ) {
    const users = await this.usersService.getPostLikersOrFailIfPostNotFound({ postId, offset: query.offset })

    return { users }
  }
}
