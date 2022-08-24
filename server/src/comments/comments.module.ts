import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import * as path from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentSchema } from './schema/comment.schema'
import { RequestService } from 'src/core/services/request.service'
import { PostsModule } from 'src/posts/posts.module'
import { AuthModule } from 'src/auth/auth.module'
import { AuthService } from 'src/auth/auth.service'
import { UsersModule } from 'src/users/users.module'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'comment', schema: CommentSchema }])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
