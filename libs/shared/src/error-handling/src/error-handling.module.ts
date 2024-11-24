import { Module } from '@nestjs/common';
import { ErrorHandlerService } from './error-handling.service';

@Module({
  providers: [ErrorHandlerService],
  exports: [ErrorHandlerService],
})
export class ErrorHandlerModule { }
