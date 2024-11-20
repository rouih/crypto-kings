import { Controller, Post, Body, Headers, Delete, Get, Query } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import logger from '@app/shared/logger/winston-logger';

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
      throw error; // You can also throw a custom exception here
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
      throw error; // You can throw a custom exception or handle the error
    }
  }

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string) {
    try {
      return await this.balancesService.getAllBalances();
    } catch (error) {
      logger.error('Error retrieving all balances:', error);
      throw error;
    }
  }

  @Get('userBalance')
  async getUserBalance(@Headers('X-User-ID') userId: string) {
    try {
      return await this.balancesService.getAllUserBalances(userId);
    } catch (error) {
      logger.error(`Error retrieving balances for user ${userId}:`, error);
      throw error;
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
      throw error;
    }
  }
}
