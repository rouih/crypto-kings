import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotFoundException } from '@app/error-handling';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
        console.log("Cache service created");
    }

    async get<T>(key: string): Promise<T | undefined> {
        return await this.cacheManager.get<T>(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl || 3600000);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async keys(): Promise<string[]> {
        // If the underlying cache store supports it
        if ('keys' in this.cacheManager.store) {
            return (this.cacheManager.store as any).keys();
        }
        throw new NotFoundException('Keys method is not supported by the current cache store');
    }

    async clear(): Promise<void> {
        await this.cacheManager.reset();
    }
}
