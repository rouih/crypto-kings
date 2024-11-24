import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RateServiceController } from './rate.controller';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheSharedModule } from 'libs/shared/src/cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/shared/logger/logger.module';
import { RequestIdMiddleware } from '@app/shared/middlewares/request-id.middleware';
import { SharedModule } from '@app/shared';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env'
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    SharedModule
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
