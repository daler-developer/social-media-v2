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
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local', isGlobal: true }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
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
