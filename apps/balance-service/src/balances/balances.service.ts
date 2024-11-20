import { Injectable, Next } from '@nestjs/common';
import { BalancesRepository } from './balances.repository';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { AssetMap } from '../../../../libs/shared/entities/balance.entity';

@Injectable()
export class BalancesService {

  constructor(private readonly balancesRepository: BalancesRepository) { }

  async getUserBalancesInCurrency(userId: string, targetCurrency: string): Promise<number> {
    return this.balancesRepository.getUserTotalCurrencyBalance(userId, targetCurrency);
  }

  async getAllUserBalances(userId: string): Promise<AssetMap> {
    return this.balancesRepository.getAllUserBalances(userId);
  }

  async getAllBalances() {
    return this.balancesRepository.getAllBalances();
  }

  async addBalance(addBalanceDto: CreateBalanceDto): Promise<void> {
    const { userId, asset, amount } = addBalanceDto;
    try {
      const userBalances = await this.balancesRepository.getAllUserBalances(userId);
      if (!userBalances[asset]) {
        userBalances[asset] = 0;
      }
      userBalances[asset] += Number(amount)
      await this.balancesRepository.saveUserBalances(userId, userBalances);
    } catch (error) {
      Next();
    }

  }

  async removeBalance(userId: string, currency: string, amount: number): Promise<void> {
    const userBalances: AssetMap = await this.balancesRepository.getAllUserBalances(userId);
    for (const [key, value] of Object.entries(userBalances)) {
      if (key === currency) {
        continue;
      }
      userBalances[key] -= amount;
    }
    await this.balancesRepository.saveUserBalances(userId, userBalances);
  }

  async calculateTotalBalance(userId: string, rates: Record<string, number>, targetCurrency: string): Promise<number> {
    const userBalances = await this.balancesRepository.getAllUserBalances(userId);
    let total = 0;

    for (const [currency, amount] of Object.entries(userBalances)) {
      if (!rates[currency]) {
        throw new Error(`Missing rate for currency: ${currency}`);
      }
      total += amount[currency] * rates[currency];
    }

    return total / rates[targetCurrency];
  }
}
