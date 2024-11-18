import { Injectable } from '@nestjs/common';
import { BalancesRepository } from './balances.repository';
import { CreateBalanceDto } from './dto/create-balance.dto';

@Injectable()
export class BalancesService {

  constructor(private readonly balancesRepository: BalancesRepository) { }

  async getUserBalances(userId: string, targetCurrency: string): Promise<number> {
    return this.balancesRepository.getUserTotalBalance(userId, targetCurrency);
  }

  getAllBalances() {
    throw new Error('Method not implemented.');
  }

  async addBalance(addBalanceDto: CreateBalanceDto): Promise<void> {
    const { userId, asset, amount } = addBalanceDto;
    const userBalances = await this.balancesRepository.getAllUserBalances(userId);
    userBalances[asset] = (+userBalances[asset] || 0) + +amount;
    await this.balancesRepository.saveUserBalances(userId, userBalances);
  }

  async removeBalance(userId: string, currency: string, amount: number): Promise<void> {
    const userBalances = await this.balancesRepository.getAllUserBalances(userId);

    if (!userBalances[currency] || userBalances[currency] < amount) {
      throw new Error(`Insufficient balance for currency: ${currency}`);
    }

    userBalances[currency] -= amount;

    if (userBalances[currency] === 0) {
      delete userBalances[currency]; // Remove the currency if the balance is zero
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
      total += amount * rates[currency];
    }

    return total / rates[targetCurrency];
  }
}
