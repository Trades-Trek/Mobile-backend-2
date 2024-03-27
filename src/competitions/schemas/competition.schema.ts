import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {COMPETITION_TYPE} from "../../enums/competition.enum";
import {Document, Types} from "mongoose";

export type CompetitionDocument = Competition & Document;
@Schema({timestamps: true})
export class Competition {
    @Prop({required: false, type: Types.ObjectId,
        ref: 'User'})
    owner: string

    @Prop({required: true})
    name: string

    @Prop({required: true})
    description: string

    @Prop({required: true, enum: COMPETITION_TYPE})
    type: string

    @Prop({required: false})
    capacity: number
    @Prop({required: false})
    start_date: Date

    @Prop({required: false})
    end_date: Date

    @Prop({required: false})
    market_delay: number

    @Prop({required: false})
    quick_sell: number

    @Prop({required: false})
    minimum_price: number

    @Prop({required: false})
    commission: number

    @Prop({required: false})
    password: string

    @Prop({required: true})
    allow_late_entry: number

    @Prop({required: true})
    allow_portfolio_viewing: number

    @Prop({required: true})
    allow_portfolio_resetting: number
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition)
