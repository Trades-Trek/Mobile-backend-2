import {IsNotEmpty} from "class-validator";

export class WithdrawDto {
    @IsNotEmpty()
    account_number: string;

    @IsNotEmpty()
    bank_code: string;

    @IsNotEmpty()
    amount: number;

}