import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({timestamps:true})
export class Chat {
    @Prop()
    message:string

    @Prop({required: true, type: Types.ObjectId,
        ref: 'User'})
    user: Types.ObjectId

    @Prop({required: true, type: Types.ObjectId,
        ref: 'Forum'})
    forum: Types.ObjectId
}
export const ForumSchema = SchemaFactory.createForClass(Forum)