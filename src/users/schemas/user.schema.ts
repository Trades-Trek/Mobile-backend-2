import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import configuration from "../../config/configuration";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";
import {DEVICE_TYPES} from "../../enums/device_types";
import {Document} from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, trim: true})
    first_name: string;
    @Prop({required: true, trim: true})
    last_name: string;

    @Prop({required: true})
    full_name: string;

    @Prop({unique: true, trim: true})
    email: string;

    @Prop({default: 'user'})
    role: string;

    @Prop({required: true, trim: true, unique: true, sparse: true})
    username: string;

    @Prop({required: true, trim: true, select:false})
    password: string;

    @Prop()
    referral_code: string;

    @Prop(raw({
        allow_notifications: {type: Boolean, default: true},
        allow_face_id: {type: Boolean, default: false},
        allow_portfolio: {type: Boolean, default: true},
        allow_stock_news: {type: Boolean, default: true},
        allow_price_alerts: {type: Boolean, default: true},
    }))
    settings: Record<string, any>;

    @Prop(raw({
        plan_id: {type: String},
        next_sub_date: {type: Date}
    }))
    subscription: Record<string, any>;

    @Prop({default: ''})
    phone: string;

    @Prop({default: '', required: false})
    your_referrer: string;

    @Prop({default: 0})
    wallet_balance: number;

    @Prop({default: 0})
    pin: number;

    @Prop({default: false})
    has_pin: boolean;

    @Prop({enum: DEVICE_TYPES, default: DEVICE_TYPES.BROWSER})
    device: string;

    @Prop({required: true, default:0})
    total_followers: number;

    @Prop({required: true, default:0})
    total_following: number;

    @Prop({
        default:
            'https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/default-user-avatar.png?alt=media&token=e58679af-a9e8-4d91-b8f5-4587be5dc714',
    })
    profile_pic: string;

    @Prop()
    last_seen: Date;

    @Prop({default: false})
    verified: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);