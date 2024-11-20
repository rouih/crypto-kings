import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingService } from './logger/logger.service';

@Module({
  providers: [SharedService, LoggingService],
  exports: [SharedService, LoggingService],
})
export class SharedModule { }
