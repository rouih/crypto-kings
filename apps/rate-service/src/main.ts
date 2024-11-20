import { NestFactory } from '@nestjs/core';
import { RateServiceModule } from './rate/rate.module';
import logger from '@app/shared/logger/winston-logger';


async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule);
  const port = process.env.port || 3002;
  await app.listen(process.env.RATE_SERVICE_PORT || 3002);
  logger.info('Rate Service is running on port ' + port, { service: 'rate-service' });
}
bootstrap();
