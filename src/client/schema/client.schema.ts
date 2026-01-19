import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/user/schema/user.schema";


export enum Status{
    LEAD="lead",
    ACTIVE="active",
    INACTIVE="inactive",
   CLOSED="closed"
}

@Schema({timestamps:true})
export class Client{
    @Prop({type:Types.ObjectId,ref:User.name})
    user:Types.ObjectId

    @Prop()
    fullName:string

    @Prop()
    email:string

    @Prop()
    phoneNumber:string
    
    @Prop()
    status:Status.LEAD
    
}

export type ClientDocument=Client & Document
export const ClientSchema=SchemaFactory.createForClass(Client)