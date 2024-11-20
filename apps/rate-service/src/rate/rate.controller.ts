import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller()
export class RateServiceController {
  constructor(private readonly rateService: RateService) { }

  @Get(':crypto')
  async getRate(@Param('crypto') crypto: string, @Query('currency') currency?: string) {
    try {
      return { rate: await this.rateService.getRate(crypto, currency) };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
