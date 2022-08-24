import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { MongooseModule } from '@nestjs/mongoose'
import { PostsModule } from './posts/posts.module'
import * as path from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { CommentsModule } from './comments/comments.module'
import { RequestService } from './core/services/request.service'
import { PopulateUserMiddleware } from './core/middleware/populate-user.middleware'

@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    MongooseModule.forRoot(
      'mongodb+srv://daler-developer:2000909k@cluster0.w93fir2.mongodb.net/?retryWrites=true&w=majority'
    ),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  providers: [RequestService],
  exports: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PopulateUserMiddleware).forRoutes('*')
  }
}
