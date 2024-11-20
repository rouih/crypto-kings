import { Controller, Get, Post, Delete, Body, Headers, Query, Next } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) { }

  @Post('add')
  async addBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { asset: string; amount: number }) {
    const newBalance = this.balancesService.addBalance(new CreateBalanceDto(userId, body.asset, body.amount));
    return newBalance
  }

  @Delete('remove')
  async removeBalance(
    @Headers('X-User-ID') userId: string,
    @Body() body: { asset: string; amount: number },
    @Query('asset') asset: string,
  ) {
    await this.balancesService.removeBalance(userId, asset, +body.amount);
    return { message: 'Balance removed successfully' };
  }

  @Get()
  async getBalances(@Headers('X-User-ID') userId: string) {
    return await this.balancesService.getAllBalances();
  }

  @Get('total')
  async getTotalBalance(
    @Headers('X-User-ID') userId: string,
    @Query('currency') targetCurrency: string,
  ) {
    return await this.balancesService.getUserBalancesInCurrency(userId, targetCurrency);
  }
}
