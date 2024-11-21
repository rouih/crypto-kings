import { Test, TestingModule } from '@nestjs/testing';
import { ErrorHandlerService } from './error-handling.service';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorHandlerService],
    }).compile();

    service = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
