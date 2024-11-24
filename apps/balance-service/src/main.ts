import { NestFactory } from '@nestjs/core';
import { BalancesModule } from './balances/balances.module';
import { HttpExceptionFilter } from '@app/shared/error-handling/src/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(BalancesModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = configService.get<number>('BALANCE_SERVICE_PORT') || 3001;
  await app.listen(port);
  console.log('Balance Service is running on port ' + port, {
    service: 'balance-service',
  });
}
bootstrap();
