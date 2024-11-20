import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    private flag = true
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
        console.log("Cache service created");
    }

    async get<T>(key: string): Promise<T | undefined> {
        console.log('Getting key from cache', key);
        console.log(await this.cacheManager.store.keys());
        console.log(this.flag);
        return await this.cacheManager.get<T>(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl || 3600000);
        this.flag = false;
        console.log(await this.cacheManager.store.keys);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async keys(): Promise<string[]> {
        // If the underlying cache store supports it
        if ('keys' in this.cacheManager.store) {
            return (this.cacheManager.store as any).keys();
        }
        throw new Error('Keys method is not supported by the current cache store');
    }
}
