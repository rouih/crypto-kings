import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

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

  handleInsufficiantBalance(message: string): void {
    throw new insufficientBalanceError(message);
  }

  handleWriteFileError(error: Error): void {
    throw new fileError(`Failed to write to file: ${error.message}`);
  }

  handleRateNotFound(message: string): void {
    throw new rateNotFoundError(message);
  }
}

class rateNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class fileError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class insufficientBalanceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
