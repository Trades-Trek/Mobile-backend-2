import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";

@Schema({timestamps: true})
export class Plan {
    @Prop({required: true})
    name: string

    @Prop({required: false})
    description: string

    @Prop({required: true})
    amount: string

    @Prop({required: true, default: 0})
    discount: number

    @Prop({required: true, enum: SUBSCRIPTION_DURATION, default: SUBSCRIPTION_DURATION.MONTHLY})
    duration: SUBSCRIPTION_DURATION;

    @Prop({type: [String]})
    features: [String]
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
