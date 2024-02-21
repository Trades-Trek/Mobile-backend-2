import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";
import {Document} from "mongoose";
import {PLAN_TYPE} from "../../enums/plan_type";

export type PlanDocument = Plan & Document;

@Schema({timestamps: true})
export class Plan {
    @Prop({required: true})
    name: string

    @Prop({required: false})
    description: string

    @Prop({required: true})
    amount: number

    @Prop({required: true, default: 0})
    discount: number

    @Prop({required: false, enum: SUBSCRIPTION_DURATION})
    duration: SUBSCRIPTION_DURATION;


    @Prop({required: false, default: PLAN_TYPE.PAID, enum:PLAN_TYPE})
    type: PLAN_TYPE

    @Prop({required: true, default: 30})
    no_of_days: number;

    @Prop({type: [String]})
    features: [String]
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
