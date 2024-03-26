import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {COMPETITION_TYPE} from "../../enums/competition.enum";
import {Types} from "mongoose";

@Schema({timestamps: true})
export class Participant {
    @Prop({required: false, type: Types.ObjectId,
        ref: 'User'})
    participant: string

    @Prop({required: false})
    email: string

    @Prop({
        type: Types.ObjectId,
        ref: 'Competition',
        required: true,
    })
    competition:Types.ObjectId

    @Prop({required: true, default:false})
    joined: boolean

}

export const ParticipantSchema = SchemaFactory.createForClass(Participant)
