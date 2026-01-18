import { IsNotEmpty } from "class-validator"
import { Status } from "../schema/client.schema"


export class createClientDto{
    @IsNotEmpty()
    fullName:string
    @IsNotEmpty()
    email:string
    @IsNotEmpty()
    phoneNumber:string
    @IsNotEmpty()
    status:Status
}