import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DEVICE_TYPES} from "../../enums/device_types";
<<<<<<< Updated upstream
import {Document, Types} from "mongoose";
import {PLAN_TYPE} from "../../enums/plan_type";
=======
<<<<<<< Updated upstream
import {Document} from "mongoose";
=======
import {Document, Types} from "mongoose";
import {DEFAULT_CURRENCY} from "../../utils/constant";
>>>>>>> Stashed changes
>>>>>>> Stashed changes

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

    @Prop({required: true, trim: true, select: false})
    password: string;

    @Prop()
    referral_code: string;

    @Prop(raw({
        allow_notifications: {type: Boolean, default:true},
        allow_face_id: {type: Boolean, default: false},
        allow_portfolio: {type: Boolean, default: true},
        allow_stock_news: {type: Boolean, default: true},
        allow_price_alerts: {type: Boolean, default: true}
    }))
    settings: Record<string, any>;


    @Prop(raw({
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
        plan_id: {type: String},
=======
>>>>>>> Stashed changes
        plan_id: {type: Types.ObjectId, required: false},
        renewal_date: {type: Date, required: false},
        has_expired: {type: Boolean, required: false},
        no_of_days_used: {type: Number, default: 0},
<<<<<<< Updated upstream
        plan_type: {type:String, required: false},
=======
        plan_type: {type: String, required: false},
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    }))
    subscription: Record<string, any>;

    @Prop({default: ''})
    phone: string;

    @Prop({type: Boolean, default: false})
    bvn_verified: boolean;

    @Prop({type: Boolean, default: false})
    phone_verified: boolean;

    @Prop({default: '', required: false})
    your_referrer: string;

    @Prop(raw({
        balance: {type: Number, default: 0},
        currency_code: {type: String, default: DEFAULT_CURRENCY.code},
        currency_symbol: {type: String, default: DEFAULT_CURRENCY.symbol}
    }))
    wallet: Record<string, any>;

    @Prop({default: 0})
<<<<<<< Updated upstream
=======
    trek_coin_balance: number;

<<<<<<< Updated upstream
=======
    @Prop({default: 0})
>>>>>>> Stashed changes
    pin: number;

    @Prop({default: false})
    has_pin: boolean;

<<<<<<< Updated upstream
    @Prop({default: false, required:true})
    has_subscribed: boolean;

=======
    @Prop({default: false, required: true})
    has_subscribed: boolean;

>>>>>>> Stashed changes
>>>>>>> Stashed changes
    @Prop({enum: DEVICE_TYPES, default: DEVICE_TYPES.BROWSER})
    device: string;

    @Prop({required: true, default: 0})
    total_followers: number;

    @Prop({required: true, default: 0})
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