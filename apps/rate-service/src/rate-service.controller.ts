import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { RateService } from './rate/rate.service';

@Controller()
export class RateServiceController {
  constructor(private readonly rateService: RateService) { }

  @Get(':crypto')
  async getRate(@Param('crypto') crypto: string) {
    try {
      return { rate: await this.rateService.getRate(crypto) };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
