import {IsNotEmpty} from "class-validator";

export class FundTrekCoinsDto  {
    @IsNotEmpty()
    trek_coins:number
}
