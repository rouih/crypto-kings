
export interface IBalancesRepository {
    getAllUserBalances(userId: string): Promise<any>;
    getAllBalances(): Promise<any>;
    addBalance(userId: string, asset: string, amount: number): Promise<void>;
    saveUserBalances(userId: string, balances: any): Promise<void>;
    getUserTotalCurrencyBalance(userId: string, targetCurrency: string): Promise<number>;
    rebalanceUserBalances(userId: string, targetPercentages: Record<string, number>, baseCurrency: string): Promise<void>;
}