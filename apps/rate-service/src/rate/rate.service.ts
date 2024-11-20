import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dotenv from 'dotenv'
import { CacheService } from '@app/shared/cache/cache.service';

dotenv.config();
@Injectable()
export class RateService implements OnModuleInit {
    private readonly coingeckoApiUrl = process.env.COINGECKO_URI || 'https://api.coingecko.com/api/v3/simple/price';
    private readonly coinGeckoIds = process.env.COINGECKO_IDS || 'bitcoin';
    private readonly coinGeckoCurrencies = process.env.COINGECKO_CURRENCIES || 'usd'

    constructor(
        private readonly httpService: HttpService,
        private readonly cacheService: CacheService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleScheduledRateUpdate() {
        console.log('Updating rates...');
        await this.updateRates();
    }

    async onModuleInit() {
        await this.updateRates();
    }

    async fetchRates(): Promise<Record<string, Record<number, number>>> {
        const response = await this.httpService.axiosRef.get(this.coingeckoApiUrl, {
            params: {
                ids: this.coinGeckoIds,
                vs_currencies: this.coinGeckoCurrencies,
            },
        });
        return response.data;
    }

    async getRate(crypto: string, currency?: string): Promise<number> {
        const rate = await this.cacheService.get(crypto); //prints undefined
        if (!rate) {
            throw new Error(`Rate for ${crypto} not available`);
        }
        return currency ? rate[currency] : rate;
    }

    async updateRates(): Promise<void> {
        console.log('Updating rates...');
        const rates = await this.fetchRates();
        for (const [crypto, value] of Object.entries(rates)) {
            await this.cacheService.set(crypto, value, 360000);
        }
    }
}
