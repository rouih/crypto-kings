import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateBalanceDto {
    constructor(userId: string, asset: string, amount: number) {
        this.userId = userId;
        this.asset = asset;
        this.amount = amount;
    }

    @IsString()
    @IsNotEmpty()
    readonly userId: string;

    @IsString()
    @IsNotEmpty()

    readonly asset: string;

    @IsNumber()
    @IsNotEmpty()
    readonly amount: number;
}


export class RebalanceDto {

    @IsNotEmpty()
    readonly targetPercentages: Record<string, number>;

    @IsString()
    @IsNotEmpty()
    readonly baseCurrency: string;
}

export class DeductBalanceDto {
    @IsString()
    @IsNotEmpty()
    readonly asset: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly amount: number;
}

export class getTotalBalanceDto {
    @IsString()
    @IsNotEmpty()
    readonly targetCurrency: string;
}

export class getBalancesDto {
    @IsString()
    @IsOptional()
    readonly userId: string;
}