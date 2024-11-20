import { Controller, Post, Body, Headers, Delete, Get, Query } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import logger from '@app/shared/logger/winston-logger';
import { InternalServerException } from 'libs/error-handling/exceptions/internal-server.exception';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) { }

  @Post('add')
  async addBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { asset: string; amount: number },
  ) {
    try {
      const newBalance = await this.balancesService.addBalance(new CreateBalanceDto(userId, body.asset, body.amount));
      return newBalance;
    } catch (error) {
      logger.error('Error adding balance:', error);
      throw new InternalServerException('Error adding balance');
    }
  }

  @Delete('remove')
  async removeBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { amount: number },
    @Query('asset') asset: string,
  ) {
    try {
      await this.balancesService.removeBalance(userId, asset, +body.amount);
      return { message: 'Balance removed successfully' };
    } catch (error) {
      logger.error('Error removing balance:', error);
      throw new InternalServerException('Error removing balance');
    }
  }

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string) {
    try {
      return await this.balancesService.getAllBalances();
    } catch (error) {
      logger.error('Error retrieving all balances:', error);
      throw new InternalServerException('Error retrieving all balances');
    }
  }

  @Get('userBalance')
  async getUserBalance(@Headers('X-User-ID') userId: string) {
    try {
      return await this.balancesService.getAllUserBalances(userId);
    } catch (error) {
      logger.error(`Error retrieving balances for user ${userId}:`, error);
      throw new InternalServerException('Error retrieving balances for user');
    }
  }

  @Get('total')
  async getTotalBalance(
    @Headers('X-User-ID') userId: string,
    @Query('currency') targetCurrency: string,
  ) {
    try {
      return await this.balancesService.getUserBalancesInCurrency(userId, targetCurrency);
    } catch (error) {
      logger.error(`Error retrieving total balance for user ${userId} in ${targetCurrency}:`, error);
      throw new InternalServerException('Error retrieving total balance');
    }
  }
}
