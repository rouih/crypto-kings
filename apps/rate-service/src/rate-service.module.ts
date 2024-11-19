import { Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateService } from './rate/rate.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule { }
