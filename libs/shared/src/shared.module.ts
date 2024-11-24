import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/src';
import { CacheSharedModule } from './cache/cache.module';
import { ErrorHandlerModule } from './error-handling/src';

@Module({
  imports: [LoggerModule, CacheSharedModule, FileModule, ErrorHandlerModule],
  providers: [SharedService, LoggerModule],
  exports: [LoggerModule, CacheSharedModule, FileModule, ErrorHandlerModule]
})
export class SharedModule { }
