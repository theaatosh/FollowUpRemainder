import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/client.schema';
import { NotesModule } from 'src/notes/notes.module';
import { FollowUpModule } from 'src/follow-up/follow-up.module';

@Module({
  imports: [
    NotesModule, FollowUpModule,
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService, MongooseModule]  // ← Export MongooseModule
})
export class ClientModule { }
