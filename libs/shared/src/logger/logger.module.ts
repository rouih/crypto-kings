import { Module } from '@nestjs/common';
import { LoggerService } from './winston-logger';

@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Export it so other modules can use it
})
export class LoggerModule {}
