import { Global, Module, } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
    imports: [
        CacheModule.register({
            ttl: 3600000, // 1 hour
            isGlobal: true,
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheSharedModule { }
