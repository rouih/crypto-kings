import { NestFactory } from '@nestjs/core';
import { RateServiceModule } from './rate-service.module';
import { LoggingService } from '@app/shared/modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule);
  console.log('Rate Service is running'); // TODO: fix that with logger
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
