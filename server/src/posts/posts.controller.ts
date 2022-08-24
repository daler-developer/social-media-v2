import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard'
import { Express, query } from 'express'
import { imagesStorage } from './images.storage'
import { CreatePostDto } from './dto/create-post.dto'
import { ValidationPipe } from 'src/core/pipes/validation.pipe'
import { PostsService } from './posts.service'
import { ParseObjectIdPipe } from 'src/core/pipes/parse-object-id.pipe'
import { Types } from 'mongoose'
import { UsersService } from 'src/users/users.service'
import { UserNotFoundException } from 'src/core/errors'
import { GetFeedPostsQueryDto } from './dto/get-feed-posts-query.dto'
import { GetUserPostsQueryDto } from './dto/get-user-posts.dto'

@Controller('/api')
export class PostsController {
  constructor(private postsService: PostsService, private usersService: UsersService) {}

  @Get('/feed/posts')
  async getFeedPosts(@Query(ValidationPipe) query: GetFeedPostsQueryDto) {
    const posts = await this.postsService.getFeedPosts({ offset: query.offset, search: query.search })

    return { posts }
  }

  @Post('/posts')
  @UseGuards(AuthRequiredGuard)
  @UseInterceptors(FileInterceptor('image', { storage: imagesStorage }))
  async createPosts(@UploadedFile() file: Express.Multer.File, @Body(ValidationPipe) body: CreatePostDto) {
    const post = await this.postsService.createPost({ ...body, filename: file.filename })

    return post
  }

  @Patch('/posts/:_id/like')
  @UseGuards(AuthRequiredGuard)
  async likePost(@Param('_id', ParseObjectIdPipe) _id: Types.ObjectId) {
    await this.postsService.likePostAndFailIfAlreadyLiked(_id)

    return { liked: true }
  }

  @Patch('/posts/:_id/unlike')
  @UseGuards(AuthRequiredGuard)
  async unlikePost(@Param('_id', ParseObjectIdPipe) _id: Types.ObjectId) {
    await this.postsService.unlikePostAndFailIfNotLikedYet(_id)

    return { unliked: true }
  }

  @Delete('/posts/:_id')
  @UseGuards(AuthRequiredGuard)
  async deletePost(@Param('_id', ParseObjectIdPipe) postId: Types.ObjectId) {
    await this.postsService.deletePostAndFailIfForbidden(postId)

    return { deleted: true }
  }

  @Get('/users/:userId/posts')
  async getUserPosts(
    @Query(ValidationPipe) query: GetUserPostsQueryDto,
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId
  ) {
    const doesNotExist = !(await this.usersService.userWithIdExists(userId))

    if (doesNotExist) {
      throw new UserNotFoundException()
    }

    const posts = await this.postsService.getPostsUserCreated({ userId, offset: query.offset, search: query.search })

    return { posts }
  }
}
