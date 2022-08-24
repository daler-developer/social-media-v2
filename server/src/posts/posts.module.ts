import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { RequestService } from 'src/core/services/request.service'
import { UsersModule } from 'src/users/users.module'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { PostSchema } from './schemas/post.schema'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'post', schema: PostSchema }])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, MongooseModule],
})
export class PostsModule {}
