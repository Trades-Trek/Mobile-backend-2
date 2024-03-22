import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import  {Types} from "mongoose";
import {User} from "../../users/schemas/user.schema";

@Schema({timestamps: true})
export class Watchlist {
    @Prop({required:true, unique:true})
    stock_price_symbol: string

    @Prop({type: Types.ObjectId, ref: 'User'})
    user: Types.ObjectId

    @Prop({type: Boolean, required:true, default: false})
    price_alert: boolean

    @Prop({required:true})
    price: number

}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
