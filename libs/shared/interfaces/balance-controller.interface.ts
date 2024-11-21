import { AssetMap, WalletMap } from 'libs/shared/entities/balance.entity';

export interface IBalanceController {
    addBalance(
        userId: string,
        body: { asset: string; amount: number },
    ): Promise<{ message: string }>;
    removeBalance(
        userId: string,
        body: { amount: number },
        asset: string,
    ): Promise<{ message: string }>;

    getBalances(userId: string): Promise<WalletMap>;

    getUserBalance(userId: string): Promise<AssetMap>;

    getTotalBalance(userId: string, targetCurrency: string): Promise<number>;
    rebalance(
        userId: string,
        targetPercentages: Record<string, number>,
        baseCurrency: string,
    ): Promise<{ message: string }>
}
