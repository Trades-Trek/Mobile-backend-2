import {UserDocument} from "../../users/schemas/user.schema";
import {TRANSACTION_STATUS} from "../../enums/transaction_status";
import {Types} from "mongoose";
import {TRANSACTION_ENTITY, TRANSACTION_TYPE} from "../../enums/transaction_type";

export class CreateTransactionDto {
    user_id:Types.ObjectId

    transfer_code?:string

    reference:string

    amount:number

    status?:TRANSACTION_STATUS

    description:string

    type:TRANSACTION_TYPE

    entity:TRANSACTION_ENTITY
}
