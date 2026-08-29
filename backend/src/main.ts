import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FRONTEND_ORIGIN, PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: FRONTEND_ORIGIN });
  await app.listen(PORT);
}
bootstrap();
