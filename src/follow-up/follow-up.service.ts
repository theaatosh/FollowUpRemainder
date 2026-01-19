import { Injectable } from '@nestjs/common';
import { FollowUp, FollowUpStatus } from './schema/followUp.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FollowUpDocument } from './schema/followUp.schema';
import { CreateFollowUpDto } from './dto/createFollowUp.dto';

@Injectable()
export class FollowUpService {

    constructor(@InjectModel(FollowUp.name) private readonly followUpModel: Model<FollowUpDocument>) { }


    async createFollowUp(userId: string, clientId: string, createFollowUpDto: CreateFollowUpDto) {
        const { scheduledAt, goal } = createFollowUpDto;
        const followUp = await this.followUpModel.create({
            user: userId,
            client: clientId,
            scheduledAt,
            goal,
            status: FollowUpStatus.PENDING,
        })
        return followUp;
    }



    async getFollowUpByClient(userId: string, clientId: string) {
        console.log("userId",userId)
        console.log("clientId",clientId)
        const followUp = await this.followUpModel.find({
            user: userId,
            client:clientId,
        })
        console.log("followuphere",followUp)
        return followUp;
    }

    async deleteFollowUpByClient(userId: string, clientId: string) {
        const followUp = await this.followUpModel.deleteMany({
            user: userId,
            client:clientId,
        })
        return followUp;
    }

}
