import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BadRequestException, InternalServerException, NotFoundException, UnauthorizedException,
  FileIOError,
  RateNotFoundError,
  UpdateBalancesError,
  InsufficientBalanceError
} from '../../error-handling/exceptions/custom-exceptions.exeption';

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

  handleValidationError(message: string): void {
    throw new BadRequestException(`Validation failed: ${message}`);
  }

  handleUnauthorized(message: string): void {
    throw new UnauthorizedException(message);
  }

  handleInsufficiantBalance(message: string): void {
    throw new InsufficientBalanceError(message);
  }

  handleWriteFileError(error: Error): void {
    throw new FileIOError(`Failed to write to file: ${error.message}`);
  }

  handleRateNotFound(message: string): void {
    throw new RateNotFoundError(message);
  }

  handleUpdateBalancesError(message: string): void {
    throw new UpdateBalancesError(message);
  }

  handleGetBalancesError(message: string): void {
    throw new NotFoundException(message);
  }

}


