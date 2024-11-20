import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
    constructor(message: string, statusCode: HttpStatus) {
        super(message, statusCode);
    }
}
