import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RateService implements OnModuleInit {
    private readonly coingeckoApiUrl = 'https://api.coingecko.com/api/v3/simple/price';

    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleScheduledRateUpdate() {
        console.log('Updating rates...');
        await this.updateRates();
    }

    async onModuleInit() {
        await this.updateRates();
    }

    async fetchRates(): Promise<Record<string, number>> {
        const response = await this.httpService.axiosRef.get(this.coingeckoApiUrl, {
            params: {
                ids: process.env.ASSETS_FETCH_IDS,
                vs_currencies: 'usd',
            },
        });
        return response.data;
    }

    async getRate(crypto: string): Promise<number> {
        const rate = await this.cacheManager.get(crypto); //prints undefined
        if (!rate) {
            throw new Error(`Rate for ${crypto} not available`);
        }
        return rate as number;
    }

    async updateRates(): Promise<void> {
        console.log('Updating rates...');
        const rates = await this.fetchRates();
        console.log(rates)
        for (const [crypto, value] of Object.entries(rates)) {
            await this.cacheManager.set(crypto, value, 360000);
        }
    }
}
