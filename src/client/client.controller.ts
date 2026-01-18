import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { createClientDto } from './dto/createClient.dto';
import type { RequestWithUser } from 'src/auth/types';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';


@Controller('client')
export class ClientController {

    constructor(private readonly clientService:ClientService){}

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
}
