import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ResetPasswordToken} from "../../users/schemas/token.schema";

@Schema({timestamps:true})
export class Watchlist {
    @Prop({required:true})
    stock_id:string

    @Prop({required:true})
    user_id:string
}

export const WatchListSchema = SchemaFactory.createForClass(Watchlist);
