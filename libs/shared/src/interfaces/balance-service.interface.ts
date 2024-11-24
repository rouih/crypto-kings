import {
  AssetMap,
  WalletMap,
} from '../../../../apps/balance-service/src/balances/entities/balance.entity';

export interface IBalancesService {
  getUserBalancesInCurrency(
    userId: string,
    targetCurrency: string,
  ): Promise<number>;
  getAllUserBalances(userId: string): Promise<AssetMap>;
  getAllBalances(): Promise<WalletMap>;
  addBalance(userId: string, asset: string, amount: number): Promise<void>;
  deductBalance(userId: string, asset: string, amount: number): Promise<void>;
  calculateTotalBalance(
    userId: string,
    rates: Record<string, number>,
    targetCurrency: string,
  ): Promise<number>;
  rebalance(
    userId: string,
    targetPercentages: Record<string, number>,
  ): Promise<void>;
}
