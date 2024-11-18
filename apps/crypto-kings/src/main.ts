import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from '@app/shared/modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log('Application cryptoKings is running on port 3000');
}
bootstrap();
