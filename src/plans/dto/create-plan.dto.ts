import {IsNotEmpty, IsArray} from "class-validator";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";

export class CreatePlanDto {
    @IsNotEmpty()
    name: string
    description: string

    @IsNotEmpty()
    duration: SUBSCRIPTION_DURATION

    @IsNotEmpty()
    no_of_days: number

    discount: number

    @IsNotEmpty()
    @IsArray()
    features: [string]
}
