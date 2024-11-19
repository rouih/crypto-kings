// libs/shared/src/modules/logging/logging.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService extends Logger {
    logInfo(message: string) {
        this.log(message);
    }

    logError(message: string, trace: string) {
        this.error(message, trace);
    }
}
