import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

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
