import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { BalancesRepository } from './balances.repository';
import { SharedModule } from 'libs/shared/src';
import { CacheSharedModule } from 'libs/shared/src/cache/cache.module';
import { FileModule } from 'libs/shared/src/file/src';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/shared/logger/logger.module';
import { RequestIdMiddleware } from '@app/shared/middlewares/request-id.middleware';
import { ErrorHandlerModule } from '@app/shared/error-handling/src';

@Module({
  imports: [SharedModule, CacheSharedModule, FileModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '../../../.env'
  }), LoggerModule, ErrorHandlerModule],
  controllers: [BalancesController],
  providers: [BalancesRepository, BalancesService],
})
export class BalancesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
