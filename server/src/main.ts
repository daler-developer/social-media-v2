import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { CatchAllExceptionFilter } from './core/exception-filters/catch-all.filter'
import { RequestExceptionFilter } from './core/exception-filters/request-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new RequestExceptionFilter())

  await app.listen(4000)
}
bootstrap()
