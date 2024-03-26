import {Module} from '@nestjs/common';
import {CompetitionsService} from './competitions.service';
import {CompetitionsController} from './competitions.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Competition, CompetitionSchema} from "./schemas/competition.schema";
import {Participant, ParticipantSchema} from "./schemas/participant.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: Competition.name, schema: CompetitionSchema}, {name:Participant.name, schema:ParticipantSchema}])],
    controllers: [CompetitionsController],
    providers: [CompetitionsService],
    exports:[CompetitionsService]
})
export class CompetitionsModule {
}
