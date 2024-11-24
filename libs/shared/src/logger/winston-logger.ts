import { Injectable } from '@nestjs/common';
import winston, { Logger } from 'winston';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                        }`;
                }),
            ),
            defaultMeta: { service: 'crypto-kings' },
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                }),
                new winston.transports.File({
                    filename: 'combined.log',
                    level: 'info',
                }),
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error',
                }),
            ],
        });

        if (process.env.NODE_ENV === 'production') {
            this.logger.add(
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
            );
        }
    }

    log(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    error(message: string, meta?: any) {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }

    trace(message: string, meta?: any) {
        this.logger.verbose(message, meta);
    }

    attachRequestId(req: Request) {
        const requestId = req.headers['x-request-id'] || uuidv4();
        this.logger.debug(`Request ID: ${requestId}`);
        return requestId;
    }
}
