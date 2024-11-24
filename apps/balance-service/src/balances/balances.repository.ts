import { Inject, Injectable, Next } from '@nestjs/common';
import * as path from 'path';
import { AssetMap, WalletMap } from './entities/balance.entity';
import { CacheService } from 'libs/shared/src/cache/cache.service';
import { FileService } from 'libs/shared/src/file/src';
import { configDotenv } from 'dotenv';
import logger from 'libs/shared/src/logger/winston-logger';
import { NotFoundException } from '@app/shared/error-handling/exceptions/exceptions.index';
import { InternalServerException } from '@app/shared/error-handling/exceptions/internal-server.exception';
import { IBalancesRepository } from '@app/shared/interfaces/balance-repository.interface';

configDotenv();

@Injectable()
export class BalancesRepository implements IBalancesRepository {
    constructor(@Inject(CacheService) private readonly cacheService: CacheService, @Inject(FileService) private readonly fileService: FileService) {
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
        if (!balances || !balances[userId]) {
            throw new NotFoundException(`User not found or no balances available`);
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

    async getRate(asset: string, targetCurrency: string): Promise<number> {
        const rate = await this.cacheService.get<number>(`${asset}-${targetCurrency}`);
        if (!rate) {
            throw new InternalServerException(`Rate for asset ${asset} and target currency ${targetCurrency} is not available`);
        }
        return rate;
    }

    async rebalanceUserBalances(
        userId: string,
        targetPercentages: Record<string, number>,
        baseCurrency: string = 'usd',
    ): Promise<void> {
        // Ensure target percentages add up to 100
        const totalPercentage = Object.values(targetPercentages).reduce((sum, p) => sum + p, 0);
        if (totalPercentage !== 100) {
            throw new Error('Target percentages must sum to 100');
        }

        // Fetch user balances
        const userBalances = await this.getAllUserBalances(userId);
        if (!userBalances || Object.keys(userBalances).length === 0) {
            throw new Error('No balances available for rebalancing');
        }

        // Fetch rates for all assets
        let totalWalletValue = 0;
        const assetValues: Record<string, number> = {};
        for (const [asset, amount] of Object.entries(userBalances)) {
            const cacheKey = `${asset}-${baseCurrency}`;
            const rate = await this.cacheService.get<number>(cacheKey); // Fetch rate from cache
            if (!rate) {
                throw new Error(`Rate for asset ${asset} is not available`);
            }

            const value = amount * rate;
            assetValues[asset] = value;
            totalWalletValue += value;
        }

        // Calculate the new balances for each asset
        const adjustedBalances: Record<string, number> = {};
        for (const [asset, targetPercentage] of Object.entries(targetPercentages)) {
            const targetValue = (targetPercentage / 100) * totalWalletValue; // Target value for the asset
            const cacheKey = `${asset}-${baseCurrency}`;
            const rate = await this.cacheService.get<number>(cacheKey); // Fetch rate again
            if (!rate) {
                throw new Error(`Rate for asset ${asset} is not available`);
            }

            adjustedBalances[asset] = targetValue / rate; // Convert value to asset amount
        }

        // Save the adjusted balances
        await this.saveUserBalances(userId, adjustedBalances);
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