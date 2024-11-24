import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InternalServerException extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
