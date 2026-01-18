/* eslint-disable prettier/prettier */

import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import  sgMail from '@sendgrid/mail';
@Injectable()
export class EmailService{

    private senderEmail:string;
    constructor(private configService:ConfigService){
    }

    async sendEmail(options:{to:string,subject:string,html:string}){
         const apiKey=this.configService.get<string>('SENDGRID_API_KEY');
        const senderEmail=this.configService.get<string>('SENDER_EMAIL_ADDRESS');

        console.log("apiKey",apiKey);
        console.log("senderEmail",senderEmail);
        if(!apiKey||!senderEmail){
            throw new InternalServerErrorException("Email configuration is missing in environment variables");
        }

        sgMail.setApiKey(apiKey);
        this.senderEmail=senderEmail;
        const msg={
            to:options.to,
            from:this.senderEmail ,
            subject:options.subject,
            html:options.html
        }

        try{
            await sgMail.send(msg);
            console.log("Email sent successfully");
        }catch(error){

            console.error("Error sending email:",error);
             throw new InternalServerErrorException("Failed to send email");
        }
    }
    async sendVerificationEmail(email:string,token:string){
        const link=`${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const html = `
      <h2>Verify your Email</h2>
      <p>Click the link below to verify:</p>
      <a href="${link}" style="color:blue;">Verify Email</a>
    `;

    return this.sendEmail({
        to:email,
        subject:"Email Verification",
        html:html})
    }
}
