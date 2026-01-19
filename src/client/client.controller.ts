import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { createClientDto } from './dto/createClient.dto';
import type { RequestWithUser } from 'src/auth/types';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { updateClientDto } from './dto/updateClient.dto';


@Controller('client')
export class ClientController {

    constructor(private readonly clientService:ClientService){}


    //to create a client
    @UseGuards(JwtGuard)
    @Post()
    async createLead(@Body() createClientDto:createClientDto, @Req() req:RequestWithUser){
        const userId=req.user.sub;

        const client=await this.clientService.createClient(userId,createClientDto);

        return {
            message:"Client created successfully",
            client
        }


    }


    //get all clients of a user
    @UseGuards(JwtGuard)
    @Get()
    async getClients(@Req() req:RequestWithUser){
        const userId=req.user.sub;
        const clients=await this.clientService.getClientsByUserId(userId);
        return {
            message:"Clients fetched successfully",
            clients
        }
    }


    //get a single with all details followup and notes
    @UseGuards(JwtGuard)
    @Get(":id")
    async getClientDetails(@Param("id") clientId:string,@Req() req:RequestWithUser){
        const userId=req.user.sub;
        const {client,notes,followUp,stats}=await this.clientService.getClientDetails(userId,clientId);
        return {
            message:"Client details fetched successfully",
            client,
            notes,
            followUp,
            stats
        }
    }


    //updates a client
    @UseGuards(JwtGuard)
    @Patch(":id")
    async updateClient(@Param("id") clientId:string ,@Body() updateClientDto:updateClientDto){

        const client=await this.clientService.updateClient(clientId,updateClientDto);
        return {
            message:"Client updated successfully",
            client
        }
    }


    @UseGuards(JwtGuard)
    @Delete(":id")
    async deleteClient(@Param("id") clientId:string,@Req() req:RequestWithUser){
        const userId=req.user.sub;
        const client=await this.clientService.deleteClient(userId,clientId);
        return {
            message:"Client deleted successfully",
            client
        }
    }
}
