import { NestFactory } from '@nestjs/core';
import { BalancesModule } from './balances/balances.module';

async function bootstrap() {
  const app = await NestFactory.create(BalancesModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
