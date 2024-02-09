import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import configuration from "../../config/configuration";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";
import {DEVICE_TYPES} from "../../enums/device_types";
@Schema({timestamps: true})
export class User {
    @Prop({required: true, trim: true})
    firstName: string;
    @Prop({required: true, trim: true})
    lastName: string;

    @Prop({required: true})
    fullName: string;

    @Prop({unique: true, trim: true})
    email: string;

    @Prop({required: true, trim: true, unique: true, sparse: true})
    username: string;

    @Prop({required: true, trim: true})
    password: string;

    @Prop()
    referalCode: string;

    @Prop({default: 0, trim: true})
    status: number;

    @Prop({default: ''})
    profileId: string;

    @Prop({default: 0})
    profitOrLossDaywise: number;

    @Prop({default: 0})
    profitOrLossTotal: number;
    @Prop({default: 0})
    point: number;

    @Prop({default: 0})
    annualReturn: number;

    @Prop({default: configuration().STARTING_CASH})
    cash: number;

    @Prop({default: configuration().STARTING_CASH})
    accountValue: number;

    @Prop({default: ''})
    phone: string;

    @Prop({default: configuration().STARTING_CASH})
    buyingPower: number;
    @Prop({default: false})
    block: boolean;
    @Prop({default: null})
    currentSubscriptionExpiryDate: Date;
    @Prop()
    subscriptionId: string;
    @Prop({
        enum: SUBSCRIPTION_DURATION,
        default: SUBSCRIPTION_DURATION.TRIAL,
    })
    subscriptionDuration: string;
    @Prop({default: ''})
    yourRefferal: string;
    @Prop({default: ''})
    joinedRefferal: string;
    @Prop({default: 0})
    walletAmount: number;
    @Prop({default: 0})
    requestAmount: number;
    @Prop({default: 0})
    withdrawAmount: number;
    @Prop({enum: DEVICE_TYPES, default: DEVICE_TYPES.BROWSER})
    device: string;
    @Prop({default: true})
    allowNotification: boolean;
    @Prop({
        default:
            'https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/default-user-avatar.png?alt=media&token=e58679af-a9e8-4d91-b8f5-4587be5dc714',
    })
    profilePic: string;
    @Prop({default: ''})
    userId: string;
    @Prop()
    lastSeen: Date;

    @Prop({default:false})
    verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);