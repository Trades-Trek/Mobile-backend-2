import {IsNotEmpty} from "class-validator";

export class BankTransferDto{
    @IsNotEmpty()
    account_number: string;

    @IsNotEmpty()
    bank_code: string;

    @IsNotEmpty()
    amount: number;
}