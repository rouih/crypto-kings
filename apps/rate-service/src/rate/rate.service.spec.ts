import { Test, TestingModule } from '@nestjs/testing';
import { RateService } from './rate.service';
import { CacheService } from 'libs/shared/src/cache/cache.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logger/winston-logger';
import { ErrorHandlerService } from '@app/shared/error-handling/src/error-handling.service';

describe('RateService', () => {
  let rateService: RateService;
  let cacheService: CacheService;
  let loggerService: LoggerService;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(async () => {
    const cacheServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const loggerServiceMock = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const errorHandlerServiceMock = {
      handleNotFound: jest.fn(),
      handleInternalServerError: jest.fn(),
    };

    const configServiceMock = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'COINGECKO_URI') return 'https://api.coingecko.com/api/v3/simple/price';
        if (key === 'COINGECKO_IDS') return 'bitcoin';
        if (key === 'COINGECKO_CURRENCIES') return 'usd';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        { provide: CacheService, useValue: cacheServiceMock },
        { provide: HttpService, useValue: { axiosRef: { get: jest.fn() } } },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceMock },
      ],
    }).compile();

    rateService = module.get<RateService>(RateService);
    cacheService = module.get<CacheService>(CacheService);
    loggerService = module.get<LoggerService>(LoggerService);
    errorHandlerService = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it('should throw an error if rate is not available in cache', async () => {
    jest.spyOn(cacheService, 'get').mockResolvedValue(undefined);

    await expect(rateService.getRate('bitcoin', 'usd')).rejects.toThrow(
      'Rate for bitcoin in usd is not available'
    );

    expect(errorHandlerService.handleNotFound).toHaveBeenCalledWith(
      'Rate for bitcoin in usd is not available'
    );
  });
});
