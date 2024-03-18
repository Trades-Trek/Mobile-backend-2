import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({timestamps:true})
export class PromoCode {
    @Prop({required:true})
    name:string

    @Prop({required:false})
    description:string

    @Prop({required:true})
    code:string

    @Prop({required:true})
    expire_at:string

    @Prop({required:true})
    start_date:string

    @Prop({required:true, default:true})
    is_active:boolean
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);