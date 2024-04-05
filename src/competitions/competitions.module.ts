import {Module} from '@nestjs/common';
import {CompetitionsService} from './competitions.service';
import {CompetitionsController} from './competitions.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Competition, CompetitionSchema} from "./schemas/competition.schema";
import {Participant, ParticipantSchema} from "./schemas/participant.schema";
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";

@Module({
    imports: [WalletModule, MongooseModule.forFeature([{name: Competition.name, schema: CompetitionSchema}, {name:Participant.name, schema:ParticipantSchema}])],
    controllers: [CompetitionsController],
    providers: [CompetitionsService, WalletService],
    exports:[CompetitionsService]
})
export class CompetitionsModule {
}
