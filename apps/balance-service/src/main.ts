import { NestFactory } from '@nestjs/core';
import { BalancesModule } from './balances/balances.module';
import logger from 'libs/shared/src/logger/winston-logger';
import { HttpExceptionFilter } from '@app/shared/error-handling/src/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BalancesModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const port = process.env.BALANCE_SERVICE_PORT || 3001;
  await app.listen(port);
  logger.info('Balance Service is running on port ' + port, { service: 'balance-service' });
}
bootstrap();
