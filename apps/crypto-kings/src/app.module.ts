import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BalancesModule } from 'apps/balance-service/src/balances/balances.module';

@Module({
  imports: [BalancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
