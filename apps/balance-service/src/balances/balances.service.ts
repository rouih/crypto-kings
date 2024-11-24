import { Inject, Injectable, Next } from '@nestjs/common';
import { BalancesRepository } from './balances.repository';
import { AssetMap, WalletMap } from './entities/balance.entity';
import { IBalancesService } from '@app/shared/interfaces/balance-service.interface';
import { ErrorHandlerService } from '@app/shared/error-handling/src/error-handling.service';
import { Decimal } from 'decimal.js';
@Injectable()
export class BalancesService implements IBalancesService {
  constructor(
    @Inject(BalancesRepository)
    private readonly balancesRepository: BalancesRepository,
    @Inject(ErrorHandlerService)
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async rebalance(
    userId: string,
    targetPercentages: Record<string, number>,
    baseCurrency = 'usd',
  ): Promise<void> {
    await this.balancesRepository.rebalanceUserBalances(
      userId,
      targetPercentages,
      baseCurrency,
    );
  }

  async getUserBalancesInCurrency(
    userId: string,
    targetCurrency: string,
  ): Promise<number> {
    return this.balancesRepository.getUserTotalCurrencyBalance(
      userId,
      targetCurrency,
    );
  }

  async getAllUserBalances(userId: string): Promise<AssetMap> {
    return this.balancesRepository.getAllUserBalances(userId);
  }

  async getAllBalances(): Promise<WalletMap> {
    return this.balancesRepository.getAllBalances();
  }

  async addBalance(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<void> {
    try {
      const userBalances =
        await this.balancesRepository.getAllUserBalances(userId);
      const currentBalance = new Decimal(userBalances[asset] || 0);
      const newBalance = currentBalance.plus(amount);

      userBalances[asset] = newBalance.toNumber();

      await this.balancesRepository.saveUserBalances(userId, userBalances);
    } catch (error) {
      Next();
    }
  }

  async deductBalance(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<void> {
    const userBalances =
      await this.balancesRepository.getAllUserBalances(userId);
    const currentBalance = new Decimal(userBalances[asset] || 0);

    if (currentBalance.lessThan(amount)) {
      this.errorHandlerService.handleInsufficiantBalance(
        `Not enough balance for ${asset}`,
      );
    }

    const newBalance = currentBalance.minus(amount);
    userBalances[asset] = newBalance.toNumber();
    await this.balancesRepository.saveUserBalances(userId, userBalances);
  }

  async calculateTotalBalance(
    userId: string,
    rates: Record<string, number>,
    targetCurrency: string,
  ): Promise<number> {
    const userBalances =
      await this.balancesRepository.getAllUserBalances(userId);
    let total = new Decimal(0);

    for (const [currency, amount] of Object.entries(userBalances)) {
      if (!rates[currency]) {
        this.errorHandlerService.handleRateNotFound(
          `Missing rate for currency: ${currency}`,
        );
      }
      total = total.plus(new Decimal(amount).times(rates[currency]));
    }

    const targetRate = new Decimal(rates[targetCurrency]);
    if (targetRate.isZero()) {
      this.errorHandlerService.handleRateNotFound(
        `Rate is zero for currency: ${targetCurrency}`,
      );
    }

    return total.dividedBy(targetRate).toNumber();
  }
}
