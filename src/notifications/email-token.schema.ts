/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


export type EmailTokenDocument=EmailToken & Document;
@Schema({timestamps:true})
export class EmailToken{
    @Prop({type:Types.ObjectId,ref:"User",required:true})
    userId:Types.ObjectId

    @Prop({type:String,required:true})
    token:string

    @Prop({type:Date,required:true,default:Date.now()+300000})
    expiresAt:Date
}

export const EmailTokenSchema=SchemaFactory.createForClass(EmailToken);