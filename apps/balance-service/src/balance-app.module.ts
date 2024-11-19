import { Module } from '@nestjs/common';
import { BalancesModule } from './balances/balances.module';
import { BalancesService } from './balances/balances.service';
import { BalancesController } from './balances/balances.controller';
import { BalancesRepository } from './balances/balances.repository';

@Module({
  imports: [BalancesModule],
  controllers: [BalancesController],
  providers: [BalancesService, BalancesRepository],
})
export class BalanceServiceModule { }
