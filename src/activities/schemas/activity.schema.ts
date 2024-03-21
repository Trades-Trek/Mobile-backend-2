import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {User} from "../../users/schemas/user.schema";

@Schema({timestamps:true})
export class Activity {
    @Prop()
    activity: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    by: User;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
