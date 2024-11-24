import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/winston-logger';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const requestId = req.headers['x-request-id'] || uuidv4();  // Generate if not provided
        req.headers['x-request-id'] = requestId;  // Attach the request ID to headers
        this.logger.attachRequestId(req);
        next();
    }
}
