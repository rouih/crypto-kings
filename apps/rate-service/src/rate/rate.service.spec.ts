import { Test, TestingModule } from '@nestjs/testing';
import { RateService } from './rate.service';
import { CacheService } from 'libs/shared/src/cache/cache.service';
import { HttpService } from '@nestjs/axios';

describe('RateService', () => {
  let rateService: RateService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const cacheServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        { provide: CacheService, useValue: cacheServiceMock },
        { provide: HttpService, useValue: {} }, // Mock HttpService if needed
      ],
    }).compile();

    rateService = module.get<RateService>(RateService);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should throw an error if rate is not available in cache', async () => {
    // Mock the cache response to return undefined
    jest.spyOn(cacheService, 'get').mockResolvedValue(undefined);

    await expect(rateService.getRate('bitcoin', 'usd')).rejects.toThrow(
      'Rate for bitcoin not available'
    );
  });

  it('should handle scheduled rate update', async () => {
    const updateRatesSpy = jest.spyOn(rateService, 'updateRates').mockResolvedValue();

    await rateService.handleScheduledRateUpdate();

    expect(updateRatesSpy).toHaveBeenCalled();
  });

  it('should update rates correctly', async () => {
    const mockRates = {
      bitcoin: { usd: 50000 },
      ethereum: { usd: 4000 },
    };
    jest.spyOn(rateService, 'fetchRates').mockResolvedValue(mockRates);
    jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

    await rateService.updateRates();

    expect(cacheService.set).toHaveBeenCalledWith('bitcoin-usd', 50000, 360000);
    expect(cacheService.set).toHaveBeenCalledWith('ethereum-usd', 4000, 360000);
  });
});
