import { NestFactory } from '@nestjs/core';
import { BalancesModule } from './balances/balances.module';
import logger from '@app/shared/logger/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(BalancesModule);
  const port = process.env.BALANCE_SERVICE_PORT || 3001;
  await app.listen(port);
  logger.info('Balance Service is running on port ' + port, { service: 'balance-service' });
}
bootstrap();
