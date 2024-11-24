import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dotenv from 'dotenv'
import { CacheService } from 'libs/shared/src/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logger/winston-logger';

dotenv.config();
@Injectable()
export class RateService implements OnModuleInit {
    constructor(
        private readonly httpService: HttpService,
        @Inject(CacheService) private readonly cacheService: CacheService,
        @Inject(ConfigService) private readonly configService: ConfigService,
        @Inject(LoggerService) private readonly logger: LoggerService) { }
    private readonly coingeckoApiUrl = this.configService.get<string>('COINGECKO_URI') || 'https://api.coingecko.com/api/v3/simple/price';
    private readonly coinGeckoIds = this.configService.get<string>('COINGECKO_IDS') || 'bitcoin';
    private readonly coinGeckoCurrencies = this.configService.get('COINGECKO_CURRENCIES') || 'usd'



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
        const rates = await this.fetchRates();

        // Loop through the crypto assets
        for (const [crypto, value] of Object.entries(rates)) {
            // Loop through each currency for that crypto
            for (const [currency, rate] of Object.entries(value)) {
                const cacheKey = `${crypto}-${currency}`;
                await this.cacheService.set(cacheKey, rate, 360000);
                this.logger.log(`Cached rate for ${crypto}-${currency}: ${rate}`);
            }
        }
    }
}
