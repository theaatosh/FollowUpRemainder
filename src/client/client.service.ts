import { Injectable } from '@nestjs/common';
import { Client, ClientDocument } from './schema/client.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createClientDto } from './dto/createClient.dto';

@Injectable()
export class ClientService {

constructor(@InjectModel(Client.name) private readonly clientModel:Model<ClientDocument>){}

//creates client with default status lead
async createClient(userId:string,createClientDto:createClientDto){

    const {fullName,phoneNumber,email,status}=createClientDto;
    
    const client=await this.clientModel.create({
        user:userId,
        fullName,
        phoneNumber,
        email,
        status
    })
    return client;
    
}


//get clients by user id
async getClientsByUserId(userId:string){
    const clients=await this.clientModel.find({user:userId});
    return clients;
}

}
