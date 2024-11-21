import { Controller, Post, Body, Headers, Delete, Get, Query, Param } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import logger from '@app/shared/logger/winston-logger';
import { InternalServerException } from 'libs/error-handling/exceptions/internal-server.exception';
import { BadRequestException } from 'libs/error-handling/exceptions/bad-request.exception';
import { AssetMap, WalletMap } from 'libs/shared/entities/balance.entity';
import { IBalanceController } from 'libs/shared/interfaces/balance-controller.interface';

@Controller('balances')
export class BalancesController implements IBalanceController {
  constructor(private readonly balancesService: BalancesService) { }


  @Post('add')
  async addBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { asset: string; amount: number },
  ): Promise<{ message: string }> {
    try {
      if (!body.asset || body.asset.length === 0) {
        throw new BadRequestException('Missing asset or asset is empty');
      }
      await this.balancesService.addBalance(new CreateBalanceDto(userId, body.asset, body.amount));
      return { message: `Balance ${body.asset} added successfully` };
    } catch (error) {
      logger.error('Error adding balance:', error);
      throw new InternalServerException(error);
    }
  }

  @Post('/rebalance')
  async rebalance(
    @Headers('X-User-ID') userId: string,
    @Body() targetPercentages: Record<string, number>,
    @Query('baseCurrency') baseCurrency = 'usd',
  ): Promise<{ message: string }> {
    try {
      const totalPercentage = Object.values(targetPercentages).reduce((sum, p) => sum + p, 0);
      if (totalPercentage !== 100) {
        throw new BadRequestException('Target percentages must sum to 100');
      }
      await this.balancesService.rebalance(userId, targetPercentages, baseCurrency);
      return { message: 'Balances rebalanced successfully' };
    } catch (error) {
      throw new InternalServerException(error);
    }
  }


  @Delete('remove')
  async removeBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { amount: number },
    @Query('asset') asset: string,
  ): Promise<{ message: string }> {
    try {
      if (!asset || asset.length === 0) {
        throw new BadRequestException('Missing asset or asset is empty');
      }
      await this.balancesService.removeBalance(userId, asset, +body.amount);
      return { message: 'Balance removed successfully' };
    } catch (error) {
      logger.error('Error removing balance:', error);
      throw new InternalServerException(error);
    }
  }


  @Get()
  async getBalances(@Headers('X-User-ID') userId: string): Promise<WalletMap> {
    try {
      return await this.balancesService.getAllBalances();
    } catch (error) {
      logger.error('Error retrieving all balances:', error);
      throw new InternalServerException(error);
    }
  }

  @Get('userBalance')
  async getUserBalance(@Headers('X-User-ID') userId: string): Promise<AssetMap> {
    try {
      if (!userId || userId.length === 0) {
        throw new BadRequestException('Missing userId or userId is empty');
      }
      return await this.balancesService.getAllUserBalances(userId);
    } catch (error) {
      logger.error(`Error retrieving balances for user ${userId}:`, error);
      throw new InternalServerException(error);
    }
  }

  @Get('total')
  async getTotalBalance(
    @Headers('X-User-ID') userId: string,
    @Query('currency') targetCurrency: string,
  ): Promise<number> {
    try {
      if (!targetCurrency || targetCurrency.length === 0) {
        throw new BadRequestException('Missing currency or currency is empty');
      }
      return await this.balancesService.getUserBalancesInCurrency(userId, targetCurrency);
    } catch (error) {
      logger.error(`Error retrieving total balance for user ${userId} in ${targetCurrency}:`, error);
      throw new InternalServerException(error);
    }
  }
}
