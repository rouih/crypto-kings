import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AssetMap, WalletMap as BalanceEntity } from './entities/balance.entity';

@Injectable()
export class BalancesRepository {

    private readonly filePath = path.resolve(__dirname, '../../../data/balances.json');

    async getAllBalances(): Promise<BalanceEntity> {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            }
            throw error;
        }
    }

    async getAllUserBalances(userId: string): Promise<AssetMap> {
        const balances = await this.getAllBalances();
        if (!balances[userId]) {
            return {};
        }
        return balances[userId];
    }

    async getUserTotalCurrencyBalance(userId: string, targetCurrency?: string): Promise<number> {
        const balances = await this.getAllUserBalances(userId);
        if (targetCurrency) {
            return balances[targetCurrency] || 0;
        }
        return balances[targetCurrency] || 0;
    }

    async saveUserBalances(userId: string, balances: AssetMap): Promise<void> {
        const allBalances = await this.getAllBalances();
        allBalances[userId] = balances;
        await fs.writeFile(this.filePath, JSON.stringify(allBalances, null, 2));
    }
}
