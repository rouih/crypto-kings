import { Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import * as dotenv from 'dotenv';

dotenv.config();
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: +process.env.REDIS_PORT || 6379,
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
export class CacheSharedModule {}
