/* eslint-disable prettier/prettier */
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {User} from "../../users/schemas/user.schema";


@Schema({timestamps: true})
export class Referral {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    referrer: User;
    @Prop({})
    email: string;
    @Prop({default: false})
    redeem: boolean
    @Prop({default: 0})
    redeemCount: Number

    @Prop({required: true})
    referredBy: string
    @Prop({default: false})
    joined: boolean

    @Prop({default: false})
    joinedDate: boolean
    @Prop({default: 0})
    per: Number
    @Prop({default: false})
    send: boolean

    @Prop({default: 0})
    amountEarned: Number


}

export const RefferalSchema = SchemaFactory.createForClass(Referral);
// RefferalSchema.plugin(mongoosePaginate);
// UserSchema.index({ title: 'text', description: 'text', tags: 'text' });
