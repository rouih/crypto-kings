import { Global, Module, } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => {
                const store = await redisStore({
                    socket: {
                        host: 'localhost',
                        port: 6379,
                    },
                });

                return {
                    store: store as unknown as CacheStore,
                    ttl: 3 * 60000, // 3 minutes (milliseconds)
                };
            },
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheSharedModule { }
