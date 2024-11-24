import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
    handleNotFound(message: string): void {
        throw new NotFoundException(message);
    }

    handleBadRequest(message: string): void {
        throw new BadRequestException(message);
    }

    handleInternalServerError(message: string): void {
        throw new InternalServerErrorException(message);
    }

    handleValidationError(message: string): void {
        throw new BadRequestException(`Validation failed: ${message}`);
    }

    handleUnauthorized(message: string): void {
        throw new UnauthorizedException(message);
    }

    notEnoughBalanceError(message: string): void {
        throw new BadRequestException(message);
    }

}
