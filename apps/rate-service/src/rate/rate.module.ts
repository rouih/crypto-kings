import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RateServiceController } from './rate.controller';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { RequestIdMiddleware } from '@app/shared/middlewares/request-id.middleware';
import { SharedModule } from '@app/shared';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env',
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    SharedModule,
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
