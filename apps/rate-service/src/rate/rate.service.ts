import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import { CacheService } from 'libs/shared/src/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logger/winston-logger';
import { ErrorHandlerService } from '@app/shared/error-handling/src/error-handling.service';

dotenv.config();

@Injectable()
export class RateService implements OnModuleInit {
    private readonly coingeckoApiUrl: string;
    private readonly coinGeckoIds: string;
    private readonly coinGeckoCurrencies: string;
    private readonly maxRetries = 3; // Number of retry attempts
    private readonly retryDelay = 5000; // Delay between retries in milliseconds

    constructor(
        private readonly httpService: HttpService,
        @Inject(CacheService) private readonly cacheService: CacheService,
        @Inject(ConfigService) private readonly configService: ConfigService,
        @Inject(LoggerService) private readonly logger: LoggerService,
        @Inject(ErrorHandlerService) private readonly errorHandlerService: ErrorHandlerService
    ) {
        this.coingeckoApiUrl = this.configService.get<string>('COINGECKO_URI') || 'https://api.coingecko.com/api/v3/simple/price';
        this.coinGeckoIds = this.configService.get<string>('COINGECKO_IDS') || 'bitcoin';
        this.coinGeckoCurrencies = this.configService.get('COINGECKO_CURRENCIES') || 'usd';
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleScheduledRateUpdate() {
        try {
            await this.updateRatesWithRetries();
            this.logger.log('Rates updated successfully');
        } catch (error) {
            this.logger.error('Failed to update rates after retries', error.stack);
        }
    }

    async onModuleInit() {
        try {
            await this.updateRatesWithRetries();
        } catch (error) {
            this.logger.error('Initial rate update failed', error.stack);
        }
    }

    private async fetchRates(): Promise<Record<string, Record<string, number>>> {
        try {
            const response = await this.httpService.axiosRef.get(this.coingeckoApiUrl, {
                params: {
                    ids: this.coinGeckoIds,
                    vs_currencies: this.coinGeckoCurrencies,
                },
            });
            return response.data;
        } catch (error) {
            this.logger.error('Error fetching rates from CoinGecko', error.stack);
            this.errorHandlerService.handleInternalServerError('Failed to fetch rates from CoinGecko');
        }
    }

    private async updateRates(): Promise<void> {
        const rates = await this.fetchRates();

        for (const [crypto, value] of Object.entries(rates)) {
            for (const [currency, rate] of Object.entries(value)) {
                const cacheKey = `${crypto}-${currency}`;
                await this.cacheService.set(cacheKey, rate, 360000);
                this.logger.log(`Cached rate for ${crypto}-${currency}: ${rate}`);
            }
        }
    }

    private async updateRatesWithRetries(): Promise<void> {
        let attempt = 0;
        while (attempt < this.maxRetries) {
            try {
                await this.updateRates();
                return; // Exit on success
            } catch (error) {
                attempt++;
                this.logger.warn(`Update rates attempt ${attempt} failed. Retrying in ${this.retryDelay / 1000}s...`);
                if (attempt === this.maxRetries) {
                    this.errorHandlerService.handleInternalServerError('Failed to update rates after maximum retries');
                }
                await this.delay(this.retryDelay); // Wait before retrying
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getRate(crypto: string, currency?: string): Promise<number> {
        const cacheKey = `${crypto}-${currency || 'usd'}`;
        const rate = await this.cacheService.get<number>(cacheKey);

        if (rate === undefined) {
            this.logger.warn(`Rate for ${cacheKey} not found in cache`);
            this.errorHandlerService.handleNotFound(`Rate for ${crypto} in ${currency} is not available`);
        }

        return rate;
    }
}
