import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConstants } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: appConstants.frontendOrigin });
  await app.listen(appConstants.port);
}
bootstrap();
