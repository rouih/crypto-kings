import { Inject, Injectable, Next } from '@nestjs/common';
import * as path from 'path';
import { AssetMap, WalletMap } from '../../../../libs/shared/entities/balance.entity';
import { CacheService } from '@app/shared/cache/cache.service';
import { FileService } from '@app/shared/file/src';
import { configDotenv } from 'dotenv';
import logger from '@app/shared/logger/winston-logger';
import { NotFoundException } from 'libs/error-handling/exceptions/not-found.exception';
import { InternalServerException } from 'libs/error-handling/exceptions/internal-server.exception';

configDotenv();

@Injectable()
export class BalancesRepository {
    constructor(
        @Inject(CacheService) private readonly cacheService: CacheService,
        @Inject(FileService) private readonly fileService: FileService
    ) {
    }

    private readonly filePath = path.resolve(__dirname, '../../../data/balances.json');
    private readonly cacheKey = 'balances'; // Key to store data in cache

    // Load all balances from file into cache (if not already loaded)
    private async loadBalancesIntoCache(): Promise<void> {
        const cachedBalances = await this.cacheService.get<WalletMap>(this.cacheKey);
        if (!cachedBalances) {
            try {
                const fileBalances = await this.fileService.readFile(this.filePath) as WalletMap;
                await this.cacheService.set(this.cacheKey, fileBalances); // Store in cache
            } catch (error) {
                if (error.code === 'ENOENT') {
                    // File doesn't exist, return an empty object
                    await this.cacheService.set(this.cacheKey, {});
                } else {
                    throw new InternalServerException('Error loading balances from file');
                }
            }
        }
    }

    async getAllBalances(): Promise<WalletMap> {
        // Ensure balances are loaded in cache
        await this.loadBalancesIntoCache();
        return this.cacheService.get<WalletMap>(this.cacheKey) || {};
    }

    async getAllUserBalances(userId: string): Promise<AssetMap> {
        const balances = await this.getAllBalances();
        if (!balances) {
            throw new NotFoundException(`User ${userId} not found`);
        }
        return balances[userId];
    }

    async addBalance(userId: string, asset: string, amount: number): Promise<void> {
        const userBalances = await this.getAllUserBalances(userId);
        userBalances[asset] = (userBalances[asset] || 0) + amount;

        await this.saveUserBalances(userId, userBalances);
    }

    async saveUserBalances(userId: string, balances: AssetMap): Promise<void> {
        const allBalances = await this.getAllBalances();

        // Update balances for the specific user
        allBalances[userId] = balances;

        await this.cacheService.set(this.cacheKey, allBalances);
        await this.fileService.writeFile(this.filePath, allBalances);
    }

    // Get the user's total balance in a target currency (e.g., USD, EUR)
    async getUserTotalCurrencyBalance(userId: string, targetCurrency: string): Promise<number> {
        const userBalances = await this.getAllUserBalances(userId);
        let total = 0;

        // Iterate over the user's assets and calculate the total in the target currency
        for (const [asset, amount] of Object.entries(userBalances)) {
            // Fetch the conversion rate from the cache for the asset
            const rate = await this.cacheService.get<number>(`${asset}-${targetCurrency}`);
            if (!rate) {
                logger.info(`Rate for asset ${asset} to ${targetCurrency} is not available`);
                continue;
            }

            total += amount * rate; // Multiply the asset amount by its conversion rate
        }

        return total;
    }
}