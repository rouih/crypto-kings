import { CreateBalanceDto } from "apps/balance-service/src/balances/dto/create-balance.dto";
import { AssetMap, WalletMap } from "../entities/balance.entity";

export interface IBalancesService {
    getUserBalancesInCurrency(userId: string, targetCurrency: string): Promise<number>;
    getAllUserBalances(userId: string): Promise<AssetMap>;
    getAllBalances(): Promise<WalletMap>;
    addBalance(addBalanceDto: CreateBalanceDto): Promise<void>;
    removeBalance(userId: string, asset: string, amount: number): Promise<void>;
    calculateTotalBalance(userId: string, rates: Record<string, number>, targetCurrency: string): Promise<number>;
}