import { Injectable } from '@nestjs/common';
import { BadRequestException, InternalServerException, NotFoundException } from '../exceptions/exceptions.index';
@Injectable()
export class ErrorHandlerService {
    handleNotFound(message: string): void {
        throw new NotFoundException(message);
    }

    handleBadRequest(message: string): void {
        throw new BadRequestException(message);
    }

    handleInternalServerError(message: string): void {
        throw new InternalServerException(message);
    }

    notEnoughBalanceError(message: string): void {
        throw new BadRequestException(message);
    }
}
