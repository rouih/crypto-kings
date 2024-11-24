import { Inject, Injectable, Next } from '@nestjs/common';
import { BalancesRepository } from './balances.repository';
import { AssetMap, WalletMap } from './entities/balance.entity';
import { InternalServerException } from '@app/shared/error-handling/exceptions/internal-server.exception';
import { IBalancesService } from '@app/shared/interfaces/balance-service.interface';
import { BadRequestException } from '@app/shared/error-handling/src';
import { ErrorHandlerService } from '@app/shared/error-handling/src/error-handling.service';

@Injectable()
export class BalancesService implements IBalancesService {

  constructor(@Inject(BalancesRepository) private readonly balancesRepository: BalancesRepository,
    @Inject(ErrorHandlerService) private readonly errorHandlerService: ErrorHandlerService) { }


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

  async addBalance(userId: string, asset: string, amount: number): Promise<void> {
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

  async deductBalance(userId: string, asset: string, amount: number): Promise<void> {
    const userBalances: AssetMap = await this.balancesRepository.getAllUserBalances(userId);
    for (const [key] of Object.entries(userBalances)) {
      if (key !== asset) {
        continue;
      }
      const currBalance = userBalances[key];
      if (currBalance < amount) {
        this.errorHandlerService.handleBadRequest('Not enough balance');
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
        this.errorHandlerService.handleNotFound(`Missing rate for currency: ${currency}`);
      }
      total += amount[currency] * rates[currency];
    }

    return total / rates[targetCurrency];
  }
}
