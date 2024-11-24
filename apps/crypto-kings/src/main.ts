import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from 'libs/shared/src/logger/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  logger.info(`Crypto Kings API is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
