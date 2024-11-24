import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { BalancesRepository } from './balances.repository';
import { SharedModule } from 'libs/shared/src';
import { CacheSharedModule } from 'libs/shared/src/cache/cache.module';
import { FileModule } from 'libs/shared/src/file/src';

@Module({
  imports: [SharedModule, CacheSharedModule, FileModule],
  controllers: [BalancesController],
  providers: [BalancesRepository, BalancesService],
})
export class BalancesModule { }
