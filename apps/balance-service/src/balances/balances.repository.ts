import { Inject, Injectable, Next } from '@nestjs/common';
import * as path from 'path';
import { AssetMap, WalletMap } from '../../../../libs/shared/entities/balance.entity';
import { CacheService } from '@app/shared/cache/cache.service';
import { FileService } from '@app/shared/file/src';
import { configDotenv } from 'dotenv';

configDotenv();

@Injectable()
export class BalancesRepository {
    constructor(
        @Inject(CacheService) private readonly cacheService: CacheService,
        @Inject(FileService) private readonly fileService: FileService
    ) { }

    private readonly filePath = path.resolve(__dirname, process.env.DB_PATH);

    async getAllBalances(): Promise<WalletMap> {
        try {
            const data = await this.fileService.readFile(this.filePath) as WalletMap;
            return data;
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
            total += amount * rate[targetCurrency];
        }

        return total;
    }

    async saveUserBalances(userId: string, balances: AssetMap): Promise<void> {
        const allBalances = await this.getAllBalances();
        allBalances[userId] = balances;
        await this.fileService.writeFile(this.filePath, allBalances);
    }
}

