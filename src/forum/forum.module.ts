import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import {Forum, ForumSchema} from "./schemas/forum.schema";

@Module({
  imports:[{name:Forum.name, schema:ForumSchema}, {name:Chat.name, schema:ChatSchema}],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
