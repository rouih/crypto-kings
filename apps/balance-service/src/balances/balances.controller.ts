import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Query,
  Inject,
} from '@nestjs/common';
import { BalancesService } from './balances.service';
import {
  CreateBalanceDto,
  DeductBalanceDto,
  getBalancesDto,
  getTotalBalanceDto,
  RebalanceDto,
} from './dto/balances.dto';
import { LoggerService } from 'libs/shared/src/logger/winston-logger';
import { InternalServerException } from '@app/shared/error-handling/exceptions/internal-server.exception';
import { BadRequestException } from '@app/shared/error-handling/exceptions/bad-request.exception';
import {
  AssetMap,
  WalletMap,
} from 'apps/balance-service/src/balances/entities/balance.entity';
import { UserId } from '@app/shared/decorators/user-id.decorator';
import { ErrorHandlerService } from '@app/shared/error-handling/src/error-handling.service';

@Controller('balances')
export class BalancesController {
  constructor(
    @Inject(BalancesService) private readonly balancesService: BalancesService,
    @Inject(LoggerService) private readonly logger: LoggerService,
    @Inject(ErrorHandlerService)
    private readonly errorHandlingService: ErrorHandlerService,
  ) {}

  @Post()
  async addBalance(
    @UserId() userId: string,
    @Body() createBalanceDto: CreateBalanceDto,
  ): Promise<{ message: string }> {
    try {
      await this.balancesService.addBalance(
        userId,
        createBalanceDto.asset,
        createBalanceDto.amount,
      );
      return {
        message: `Balance ${createBalanceDto.asset} added successfully`,
      };
    } catch (error) {
      this.logger.error('Error adding balance:', error);
      throw new InternalServerException(error);
    }
  }

  @Post('/rebalance')
  async rebalance(
    @UserId() userId: string,
    @Body() rebalanceDto: RebalanceDto,
  ): Promise<{ message: string }> {
    try {
      const totalPercentage = Object.values(
        rebalanceDto.targetPercentages,
      ).reduce((sum, p) => sum + p, 0);
      if (totalPercentage !== 100) {
        throw new BadRequestException('Target percentages must sum to 100');
      }
      await this.balancesService.rebalance(
        userId,
        rebalanceDto.targetPercentages,
        rebalanceDto.baseCurrency,
      );
      return { message: 'Balances rebalanced successfully' };
    } catch (error) {
      throw new InternalServerException(error);
    }
  }

  @Put()
  async deductBalance(
    @UserId() userId: string,
    @Body() deductBalanceDto: DeductBalanceDto,
  ): Promise<{ message: string }> {
    try {
      await this.balancesService.deductBalance(
        userId,
        deductBalanceDto.asset,
        deductBalanceDto.amount,
      );
      return { message: 'Balance removed successfully' };
    } catch (error) {
      this.logger.error('Error removing balance:', error);
      throw new InternalServerException(error);
    }
  }

  @Get()
  async getBalances(
    @Query() userDto?: getBalancesDto,
  ): Promise<WalletMap | AssetMap> {
    try {
      if (userDto.userId) {
        // Return balances specific to the user
        this.logger.trace('Retrieving balances for user ' + userDto.userId);
        return await this.balancesService.getAllUserBalances(userDto.userId);
      }
      // Return all balances if no userId is provided
      this.logger.trace('Retrieving all balances');
      return await this.balancesService.getAllBalances();
    } catch (error) {
      this.logger.error('Error retrieving balances:', error);
      throw new InternalServerException(error);
    }
  }

  @Get('total')
  async getTotalBalance(
    @UserId() userId: string,
    @Body() getTotalBalanceDto: getTotalBalanceDto,
  ): Promise<number> {
    try {
      return await this.balancesService.getUserBalancesInCurrency(
        userId,
        getTotalBalanceDto.targetCurrency,
      );
    } catch (error) {
      this.logger.error(
        `Error retrieving total balance for user ${userId} in ${getTotalBalanceDto.targetCurrency}:`,
        error,
      );
      throw new InternalServerException(error);
    }
  }
}
