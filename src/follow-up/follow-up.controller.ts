import { BadRequestException, Body, Controller, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateFollowUpDto } from './dto/createFollowUp.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import type { RequestWithUser } from 'src/auth/types';
import { FollowUpService } from './follow-up.service';

@Controller('follow-up')
export class FollowUpController {

    constructor(private readonly followUpService: FollowUpService) { }
    @UseGuards(JwtGuard)
    @Post('/:clientId')
    async createFollowUp(@Req() req: RequestWithUser, @Param('clientId') clientId: string, @Body() createFollowUpDto: CreateFollowUpDto) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new UnauthorizedException("User not found");
        }
        if (!clientId) {
            throw new BadRequestException("Client ID is required");
        }
        const followUp = await this.followUpService.createFollowUp(userId, clientId, createFollowUpDto);
        return { message: "Follow-up created successfully", followUp };
    }
}


