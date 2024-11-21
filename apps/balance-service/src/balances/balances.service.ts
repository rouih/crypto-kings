import { Injectable, Next } from '@nestjs/common';
import { BalancesRepository } from './balances.repository';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { AssetMap, WalletMap } from '../../../../libs/shared/entities/balance.entity';
import { InternalServerException } from 'libs/error-handling/exceptions/internal-server.exception';
import { IBalancesService } from 'libs/shared/interfaces/balance-service.interface';
import { BadRequestException } from 'libs/error-handling/exceptions/bad-request.exception';

@Injectable()
export class BalancesService implements IBalancesService {

  constructor(private readonly balancesRepository: BalancesRepository) { }


  async rebalance(userId: string, targetPercentages: Record<string, number>, baseCurrency = 'usd'): Promise<void> {
    await this.balancesRepository.rebalanceUserBalances(userId, targetPercentages, baseCurrency);
  }

  async getUserBalancesInCurrency(userId: string, targetCurrency: string): Promise<number> {
    return this.balancesRepository.getUserTotalCurrencyBalance(userId, targetCurrency);
  }

  async getAllUserBalances(userId: string): Promise<AssetMap> {
    return this.balancesRepository.getAllUserBalances(userId);
  }

  async getAllBalances(): Promise<WalletMap> {
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

  async removeBalance(userId: string, asset: string, amount: number): Promise<void> {
    const userBalances: AssetMap = await this.balancesRepository.getAllUserBalances(userId);
    for (const [key] of Object.entries(userBalances)) {
      if (key !== asset) {
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
        throw new InternalServerException(`Missing rate for currency: ${currency}`);
      }
      total += amount[currency] * rates[currency];
    }

    return total / rates[targetCurrency];
  }
}
