import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AssetMap, WalletMap as BalanceEntity } from './entities/balance.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from '@app/shared/cache/cache.service';


@Injectable()
export class BalancesRepository {
    constructor(@Inject(CacheService) private readonly cacheService: CacheService) { }

    private readonly filePath = path.resolve(__dirname, '../../../data/balances.json');

    async getAllBalances(): Promise<BalanceEntity> {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            }
            throw error;
        }
    }

    async getAllUserBalances(userId: string): Promise<AssetMap> {
        const balances = await this.getAllBalances();
        if (!balances[userId]) {
            return {};
        }
        return balances[userId];
    }

    async getUserTotalCurrencyBalance(userId: string, targetCurrency?: string): Promise<number> {
        const userBalances = await this.getAllUserBalances(userId);
        let total = 0;
        for (const [asset, amount] of Object.entries(userBalances)) {
            // Fetch the conversion rate from the cache
            const rate = await this.cacheService.get<Number>(asset) as number;
            if (!rate) {
                throw new Error(`Rate for asset ${asset} is not available`);
            }
            total += amount * rate;
        }

        return total;
    }

    async saveUserBalances(userId: string, balances: AssetMap): Promise<void> {
        const allBalances = await this.getAllBalances();
        allBalances[userId] = balances;
        await fs.writeFile(this.filePath, JSON.stringify(allBalances, null, 2));
    }
}
