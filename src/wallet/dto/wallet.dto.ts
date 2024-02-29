import {IsNotEmpty} from "class-validator";

export class FundTrekCoinsDto  {
    @IsNotEmpty()
    trek_coins:number
}

export class FundWalletDto  {
    @IsNotEmpty()
    trek_coins:number
}
