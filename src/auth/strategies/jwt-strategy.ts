/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../types";
import { Request } from "express";




@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy,"jwt"){
    constructor(private config:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([
                (request:Request)=>{
                const authHeader=request.headers.authorization;
                const token=authHeader?.split(" ")[1]??null;
                return token;


                }
            ]),
            secretOrKey:config.get<string>("ACCESS_TOKEN_SECRET")!,
            ignoreExpiration:false,
        })
       

    }
 
     validate(payload:TokenPayload){
        console.log('🔐 JWT Token payload received:', payload);
        return {userId:payload.sub,role:payload.role};
    }

}