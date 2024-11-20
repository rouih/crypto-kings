import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BalancesModule } from 'apps/balance-service/src/balances/balances.module';
import { RateServiceModule } from 'apps/rate-service/src/rate/rate.module';
import { CacheSharedModule } from '@app/shared/cache/cache.module';

@Module({
  imports: [CacheSharedModule, RateServiceModule, BalancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
