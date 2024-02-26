import {UserDocument} from "../../users/schemas/user.schema";
import {TRANSACTION_STATUS} from "../../enums/transaction_status";
import {Types} from "mongoose";
<<<<<<< Updated upstream
import {TRANSACTION_TYPE} from "../../enums/transaction_type";
=======
import {TRANSACTION_ENTITY, TRANSACTION_TYPE} from "../../enums/transaction_type";
>>>>>>> Stashed changes

export class CreateTransactionDto {
    user_id:Types.ObjectId

    amount:number

    status?:TRANSACTION_STATUS

    description:string

    transaction_type:TRANSACTION_TYPE
<<<<<<< Updated upstream
=======

    entity:TRANSACTION_ENTITY
>>>>>>> Stashed changes
}
