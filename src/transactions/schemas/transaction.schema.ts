import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {TRANSACTION_STATUS} from "../../enums/transaction_status";
import {TRANSACTION_TYPE} from "../../enums/transaction_type";

export type TransactionDocument = Transaction & Document;

@Schema({timestamps: true})
export class Transaction {
    @Prop()
    amount: number;

    @Prop({type: Types.ObjectId, required: true})
    user_id: Types.ObjectId

    @Prop({enum: TRANSACTION_TYPE, required: true})
    type: TRANSACTION_TYPE

    @Prop()
    description: string

    @Prop({enum: TRANSACTION_STATUS, required: true, default: TRANSACTION_STATUS.SUCCESS})
    status: TRANSACTION_STATUS

    // @Prop({required:false})
    // description: string

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);