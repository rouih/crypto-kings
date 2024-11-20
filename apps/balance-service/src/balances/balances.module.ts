import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { BalancesRepository } from './balances.repository';
import { SharedModule } from '@app/shared';
import { CacheSharedModule } from '@app/shared/cache/cache.module';

@Module({
  imports: [SharedModule, CacheSharedModule],
  controllers: [BalancesController],
  providers: [BalancesRepository, BalancesService],
})
export class BalancesModule { }
