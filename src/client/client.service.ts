import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Client, ClientDocument } from './schema/client.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { createClientDto } from './dto/createClient.dto';
import { updateClientDto } from './dto/updateClient.dto';
import { NotesService } from 'src/notes/notes.service';
import { FollowUpService } from 'src/follow-up/follow-up.service';

@Injectable()
export class ClientService {

constructor(@InjectModel(Client.name) private readonly clientModel:Model<ClientDocument>,
    @InjectConnection() private readonly connection:Connection,
    private readonly notesService:NotesService,
    private readonly followupService:FollowUpService,

){}

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

//get the client details with notes and followups
async getClientDetails(userId:string,clientId:string){
    const [client,notes,followUp]=await Promise.all([
        this.clientModel.findOne({_id:clientId,user:userId}),
        this.notesService.getNotesByClient(userId,clientId),
        this.followupService.getFollowUpByClient(userId,clientId)
    ])
    if(!client){
        throw new NotFoundException("Client not found")
    }
    return {client,notes,followUp,
        stats:{
            totalNotes:notes.length,
            totalFollowUps:followUp.length,
            
        }
    }
}


//get clients by user id
async getClientsByUserId(userId:string){
    const clients=await this.clientModel.find({user:userId});
    return clients;
}

//updates client by id
async updateClient(clientId:string,updateClientDto:updateClientDto){
    const client=await this.clientModel.findByIdAndUpdate(clientId,updateClientDto,{new:true});
    return client;
}


//deletes client by id
async deleteClient(userId:string,clientId:string){
    const session=await this.connection.startSession();
    session.startTransaction();
    try{
        console.log("userId",userId)
        console.log("clientId",clientId)
        //delete client
        const client=await this.clientModel.findOneAndDelete({
            _id:new Types.ObjectId(clientId),
            user:userId
        })
        if(!client){
            throw new NotFoundException("Client not found")
        }

        //delete notes
        await this.notesService.deleteNotesByClient(userId,clientId);

        //delete followups
        await this.followupService.deleteFollowUpByClient(userId,clientId);

        //commit transaction
        await session.commitTransaction();
        
    }   catch(error){
        //rollback transaction
        await session.abortTransaction();
         // Re-throw HTTP exceptions (business logic errors)
  if (error instanceof NotFoundException || 
      error instanceof BadRequestException ||
      error instanceof ForbiddenException) {
    throw error;  // ← Pass through as-is
  }
        throw new InternalServerErrorException("Internal Server Error");
    } finally {
        session.endSession();
    } 
}




}

// my every endpoints for the  client creation deletion updation and get and notes createin deletin and updation is created and settings is also created using the default settings . now what i want when the user clicks on a particular client there will be a add folloup button when the user clicks that a moadal will open where user can seelct date and time when the followup should be shcudlued along with a note of the followup . now what i want is i want to create a followup based on user input and what is thmain thing is that followup should be remaided to user acco to the setting and followup remainder should also be bases on timezone of the user which is stored in the settings . and the other things is that user should not be notified when its quiet hours . i want this using bullmq so that . tell me the production grade way to achieve this . provide me the implementation plan how can it be done how should the date come from frtoennd how should it be stroed and how will the user gets notifeid .i need eveything .provide the detailed implementation along with what to use and hwo to use and why to use