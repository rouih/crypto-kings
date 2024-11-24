import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggerModule } from './logger/logger.module';

@Module({
  providers: [SharedService, LoggerModule],
  exports: [SharedService, LoggerModule],
})
export class SharedModule { }
