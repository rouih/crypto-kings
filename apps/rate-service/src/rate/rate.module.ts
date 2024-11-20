import { Module } from '@nestjs/common';
import { RateServiceController } from './rate.controller';
import { RateService } from './rate.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheSharedModule } from '@app/shared/cache/cache.module';
@Module({
  imports: [
    HttpModule,
    CacheSharedModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule { }
