import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import type { RequestWithUser } from 'src/auth/types';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get('profile')
    async getProfile(@Request() req:RequestWithUser) {
       const profile= await this.userService.getProfile(req.user.sub);
        return {
            message: "Profile fetched successfully",
            data:profile,
            success: true,
        }
    }
}
