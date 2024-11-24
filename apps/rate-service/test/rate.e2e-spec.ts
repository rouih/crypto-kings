import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RateServiceController } from '../src/rate/rate.controller';
import { RateService } from '../src/rate/rate.service';
import { CacheService } from '../../../libs/shared/src/cache/cache.service';
import { LoggerService } from '../../../libs/shared/src/logger/winston-logger';
import { ErrorHandlerService } from '../../../libs/shared/src/error-handling/src/error-handling.service';

describe('RateServiceController (e2e)', () => {
  let app: INestApplication;
  let rateService: RateService;
  let cacheService: CacheService;
  let loggerService: LoggerService;
  let errorHandlerService: ErrorHandlerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RateServiceController],
      providers: [
        RateService,
        CacheService,
        LoggerService,
        ErrorHandlerService,
      ],
    })
      .overrideProvider(CacheService)
      .useValue({
        get: jest.fn(),
        set: jest.fn(),
      })
      .overrideProvider(RateService)
      .useValue({
        getRate: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    rateService = moduleFixture.get<RateService>(RateService);
    cacheService = moduleFixture.get<CacheService>(CacheService);
    loggerService = moduleFixture.get<LoggerService>(LoggerService);
    errorHandlerService = moduleFixture.get<ErrorHandlerService>(ErrorHandlerService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return rate for existing crypto', async () => {
    const mockRate = 50000;
    jest.spyOn(rateService, 'getRate').mockResolvedValue(mockRate);

    const response = await request(app.getHttpServer())
      .get('/bitcoin')
      .query({ currency: 'usd' });

    expect(response.status).toBe(200);
    expect(response.body.rate).toBe(mockRate);
  });

  it('should return rate for crypto when currency is not provided', async () => {
    const mockRate = 50000;
    jest.spyOn(rateService, 'getRate').mockResolvedValue(mockRate);

    const response = await request(app.getHttpServer()).get('/bitcoin');

    expect(response.status).toBe(200);
    expect(response.body.rate).toBe(mockRate);
  });

  it('should return error if rate not found', async () => {
    jest.spyOn(rateService, 'getRate').mockRejectedValue(new Error('Rate not available'));

    const response = await request(app.getHttpServer())
      .get('/bitcoin')
      .query({ currency: 'usd' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Rate not available');
  });

  it('should handle missing crypto gracefully', async () => {
    jest.spyOn(rateService, 'getRate').mockRejectedValue(new Error('Crypto not found'));

    const response = await request(app.getHttpServer())
      .get('/nonexistentcrypto')
      .query({ currency: 'usd' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Crypto not found');
  });
});
