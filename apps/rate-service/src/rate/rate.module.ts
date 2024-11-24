import { Module } from '@nestjs/common';
import { RateServiceController } from './rate.controller';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheSharedModule } from 'libs/shared/src/cache/cache.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env'
    }),
    HttpModule,
    CacheSharedModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule { }
