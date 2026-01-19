import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";


export class CreateFollowUpDto{
    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    scheduledAt:Date;
    @IsNotEmpty()
    @IsString()
    goal:string;
  
}