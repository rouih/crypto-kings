import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { BalancesRepository } from './balances.repository';
import { SharedModule } from 'libs/shared/src';
import { CacheSharedModule } from 'libs/shared/src/cache/cache.module';
import { FileModule } from 'libs/shared/src/file/src';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SharedModule, CacheSharedModule, FileModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '../../../.env'
  }),],
  controllers: [BalancesController],
  providers: [BalancesRepository, BalancesService],
})
export class BalancesModule { }
