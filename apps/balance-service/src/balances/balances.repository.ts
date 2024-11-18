import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class BalancesRepository {
    private readonly filePath = path.resolve(__dirname, '../../../data/balances.json');

    async getAllBalances(): Promise<Record<string, any>> {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, return empty object
                return {};
            }
            throw error;
        }
    }

    async getAllUserBalances(userId: string): Promise<Record<string, number>> {
        const balances = await this.getAllBalances();
        return balances[userId] || {};
    }

    async getUserTotalBalance(userId: string, targetCurrency: string): Promise<number> {
        const balances = await this.getAllUserBalances(userId);
        return balances[targetCurrency] || 0;
    }

    async saveUserBalances(userId: string, balances: Record<string, number>): Promise<void> {
        const allBalances = await this.getAllBalances();
        allBalances[userId] = balances;
        await fs.writeFile(this.filePath, JSON.stringify(allBalances, null, 2));
    }
}
