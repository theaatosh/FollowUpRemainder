/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../types";




@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy,"jwt"){
    constructor(private config:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.get<string>("ACCESS_TOKEN_SECRET")!,
            ignoreExpiration:false,
        })
       

    }
 
     validate(payload:TokenPayload){
        return {userId:payload.sub,role:payload.role};
    }

}