import { Test, TestingModule } from '@nestjs/testing';
import { BalancesService } from './balances.service';
import { BalancesRepository } from './balances.repository';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { AssetMap } from '../../../../libs/shared/entities/balance.entity';
import { CacheService } from '@app/shared/cache/cache.service';

describe('BalancesService', () => {
    let balancesService: BalancesService;
    let balancesRepository: BalancesRepository;
    let cacheService: CacheService;

    beforeEach(async () => {
        const balancesRepositoryMock = {
            getAllUserBalances: jest.fn(),
            saveUserBalances: jest.fn(),
            getUserTotalCurrencyBalance: jest.fn(),
        };

        const cacheServiceMock = {
            get: jest.fn(),
            set: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BalancesService,
                { provide: BalancesRepository, useValue: balancesRepositoryMock },
                { provide: CacheService, useValue: cacheServiceMock },
            ],
        }).compile();

        balancesService = module.get<BalancesService>(BalancesService);
        balancesRepository = module.get<BalancesRepository>(BalancesRepository);
        cacheService = module.get<CacheService>(CacheService);
    });
    it('should throw error if rate for a currency is missing', async () => {
        const userId = '123';
        const rates = { bitcoin: 50000 }; // Missing rate for 'ethereum'
        const targetCurrency = 'usd';
        const mockUserBalances = { bitcoin: 1, ethereum: 2 };

        jest.spyOn(balancesRepository, 'getAllUserBalances').mockResolvedValue(mockUserBalances);

        await expect(
            balancesService.calculateTotalBalance(userId, rates, targetCurrency),
        ).rejects.toThrow('Missing rate for currency: ethereum');
    });

    it('should add balance correctly', async () => {
        const addBalanceDto = new CreateBalanceDto('123', 'bitcoin', 10);
        const mockUserBalances = { bitcoin: 5, ethereum: 10 };

        jest.spyOn(balancesRepository, 'getAllUserBalances').mockResolvedValue(mockUserBalances);
        jest.spyOn(balancesRepository, 'saveUserBalances').mockResolvedValue(undefined);

        await balancesService.addBalance(addBalanceDto);

        // Check if the balances are correctly updated
        expect(balancesRepository.getAllUserBalances).toHaveBeenCalledWith('123');
        expect(balancesRepository.saveUserBalances).toHaveBeenCalledWith('123', { bitcoin: 15, ethereum: 10 });
    });
});
