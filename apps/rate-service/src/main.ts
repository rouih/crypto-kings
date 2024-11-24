import { NestFactory } from '@nestjs/core';
import { RateServiceModule } from './rate/rate.module';
import { HttpExceptionFilter } from '@app/shared/error-handling/src/http-exception.filter';
import { LoggerService } from '@app/shared/logger/winston-logger';


async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule);
  const logger = app.get(LoggerService);
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.port || 3002;
  await app.listen(process.env.RATE_SERVICE_PORT || 3002);
  logger.log('Rate Service is running on port ' + port, { service: 'rate-service' });
}
bootstrap();
