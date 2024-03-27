import {Injectable} from '@nestjs/common';
import {CreateCompetitionDto} from './dto/create-competition.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Competition, CompetitionDocument} from "./schemas/competition.schema";
import {Model, Types} from "mongoose";
import {Pagination} from "../enums/pagination.enum";
import {UserDocument} from "../users/schemas/user.schema";
import {returnErrorResponse, successResponse} from "../utils/response";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {ConfigService} from "@nestjs/config";
import {COMPETITION_ENTRY, COMPETITION_TYPE} from "../enums/competition.enum";
import {WalletService} from "../wallet/wallet.service";
import {generateCode} from "../utils/constant";
import {ActivitiesService} from "../activities/activities.service";
import {ACTIVITY_ENTITY, ACTIVITY_MESSAGES} from "../enums/activities.enum";
import {Participant, ParticipantDocument} from "./schemas/participant.schema";

@Injectable()
export class CompetitionsService {
    constructor(@InjectModel(Competition.name) private competitionModel: Model<Competition>, @InjectModel(Participant.name) private participantModel: Model<Participant>, private configService: ConfigService, private walletsService: WalletService, private activityService: ActivitiesService) {
    }

    async create(user: UserDocument, createCompetitionDto: CreateCompetitionDto) {
        const {capacity, type, starting_cash, entry, participant_email} = createCompetitionDto;
        const {minStartingCash, maxStartingCash, participantFee} = this.getMinAndMaxStartingCash()
        // compare starting cash
        if (starting_cash < minStartingCash || starting_cash > maxStartingCash) returnErrorResponse(ERROR_MESSAGES.STARTING_CASH_ERROR)
        // check capacity
        if (type === COMPETITION_TYPE.GROUP) {
            const capacityFeeToBeDebited = capacity * participantFee
            if (capacityFeeToBeDebited > user.trek_coin_balance) {
                // show owner his trek coins balance capacity
                const yourTrekCoinsCapacity = user.trek_coin_balance / participantFee;
                returnErrorResponse(`Sorry, your trek coins balance can only Solicit for ${yourTrekCoinsCapacity} capacity`)
            }
            // debit user trek coins
            await this.walletsService.debitUserTrekCoins(user, capacityFeeToBeDebited)
        }
        // create competition
        createCompetitionDto['owner'] = user.id
        if (entry === COMPETITION_ENTRY.CLOSED) {
            createCompetitionDto['password'] = generateCode(6)
        }
        const competition = await this.competitionModel.create(createCompetitionDto)
        await this.findOrCreateParticipant(competition.id, user.email, user.id)
        await this.joinCompetition(user, competition.id)
        // invite participants
        if (participant_email && type === COMPETITION_TYPE.GROUP) {
            const participant = await this.findOrCreateParticipant(competition.id, participant_email)
            this.inviteParticipant(participant, competition, user)
            // generate receipt for competition
        }
        // create activity
        this.activityService.create({
            activity: ACTIVITY_MESSAGES.CREATED_COMPETITION,
            by: user,
            entity: ACTIVITY_ENTITY.COMPETITION
        })
        return successResponse({competition, message: SUCCESS_MESSAGES.COMPETITION_CREATED})
    }

    async findAll(user: UserDocument, pagination: Pagination) {
        const myCompetitions = await this.competitionModel.find({owner: user.id}).limit(pagination.limit).skip(pagination.page);
        return successResponse({my_competitions: myCompetitions})
    }

    async findOne(competitionId: Types.ObjectId): Promise<Competition | undefined> {
        return this.competitionModel.findById(competitionId)
    }

    async findOrCreateParticipant(competitionId: Types.ObjectId, participantEmail: string, ownerId: Types.ObjectId = null) {
        return await this.participantModel.findOne({email: participantEmail}) ?? await this.participantModel.create({
            participant: ownerId,
            competition: competitionId,
            email: participantEmail,
            is_owner: !!ownerId
        })
    }


    async joinCompetition(user: UserDocument, competitionId: Types.ObjectId): Promise<boolean> {
        const competitionRequest = await this.participantModel.findOne({email: user.email, competition: competitionId})
        if (!competitionRequest) returnErrorResponse(ERROR_MESSAGES.COMPETITION_REQUEST_NOT_FOUND)
        await competitionRequest.updateOne({}, {
            joined: true,
            participant: user.id
        })
        await this.activityService.create({
            activity: ACTIVITY_MESSAGES.JOINED_COMPETITION,
            entity: ACTIVITY_ENTITY.COMPETITION,
            by: user
        })
        // send push notification to competition owner
        return true;
    }


    async remove(competitionId: Types.ObjectId, user: UserDocument) {
        const competition = await this.competitionModel.findOne({'_id': competitionId, owner: user.id})
        if (!competition) returnErrorResponse(ERROR_MESSAGES.COMPETITION_NOT_FOUND)
        await competition.deleteOne()
        return successResponse(SUCCESS_MESSAGES.COMPETITION_DELETED)
    }

    getMinAndMaxStartingCash(): { minStartingCash: number, maxStartingCash: number, participantFee: number } {
        return {
            minStartingCash: parseInt(this.configService.get('MIN_STARTING_CASH')),
            maxStartingCash: parseInt(this.configService.get('MAX_STARTING_CASH')),
            participantFee: parseInt(this.configService.get('PARTICIPANT_FEE'))
        }
    }

    async inviteParticipant(participant: ParticipantDocument, competition: CompetitionDocument, owner: UserDocument) {
        if (participant.participant) {
            // participant is a user on trades trek
        } else {
            // not a user on trades trek
        }
    }

    async getCompetitionRequests(user: UserDocument, pagination: Pagination) {
        const competitionRequests = await this.participantModel.find({
            email: user.email,
            joined: false
        },).skip(pagination.page).limit(pagination.limit)
        return successResponse({competition_requests: competitionRequests})
    }

}
