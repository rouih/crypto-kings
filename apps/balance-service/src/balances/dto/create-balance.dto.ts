export class CreateBalanceDto {
    constructor(userId: string, asset: string, amount: number) {
        this.userId = userId;
        this.asset = asset;
        this.amount = amount;
    }
    readonly userId: string;
    readonly asset: string;
    readonly amount: number;
}
