import { HttpException, HttpStatus } from "@nestjs/common";


class BaseException extends HttpException {
    constructor(message: string, statusCode: HttpStatus) {
        super(message, statusCode);
    }
}
class RateNotFoundError extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

class InternalServerException extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

class NotFoundException extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

class BadRequestException extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

class FileIOError extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}

class InsufficientBalanceError extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_ACCEPTABLE);
    }
}
class UpdateBalancesError extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

class UnauthorizedException extends BaseException {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}


export {
    RateNotFoundError,
    InternalServerException,
    NotFoundException,
    BadRequestException,
    FileIOError,
    InsufficientBalanceError,
    UpdateBalancesError,
    UnauthorizedException,
    BaseException
}