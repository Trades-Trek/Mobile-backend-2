import {Injectable} from '@nestjs/common';
import {CreateCompetitionDto, JoinCompetitionDto} from '.././dto/create-competition.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Competition, CompetitionDocument} from ".././schemas/competition.schema";
import {Model, Types} from "mongoose";
import {Pagination} from "../../enums/pagination.enum";
import {UserDocument} from "../../users/schemas/user.schema";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {SUCCESS_MESSAGES} from "../../enums/success-messages";
import {ERROR_MESSAGES} from "../../enums/error-messages";
import {ConfigService} from "@nestjs/config";
import {COMPETITION_ENTRY, COMPETITION_STATUS, COMPETITION_TYPE} from "../../enums/competition.enum";
import {WalletService} from "../../wallet/wallet.service";
import {generateCode} from "../../utils/constant";
import {ActivitiesService} from "../../activities/activities.service";
import {ACTIVITY_ENTITY, ACTIVITY_MESSAGES} from "../../enums/activities.enum";
import {Participant, ParticipantDocument} from ".././schemas/participant.schema";
import {QueueService} from "../../queues/queue.service";
import {EMAIL_SUBJECTS} from "../../enums/emails.enum";
import {useOneSignalService} from "../../services/onesignal";

const onesignalService = useOneSignalService()

@Injectable()
export class CompetitionsService {
    constructor(@InjectModel(Competition.name) private competitionModel: Model<Competition>, @InjectModel(Participant.name) private participantModel: Model<Participant>, private configService: ConfigService, private walletsService: WalletService, private activityService: ActivitiesService, private queueService: QueueService) {
    }

    async create(user: UserDocument, createCompetitionDto: CreateCompetitionDto) {
        const {capacity, type, starting_cash, entry, participants, is_default} = createCompetitionDto;
        const {minStartingCash, maxStartingCash, capacityFee} = this.getMinAndMaxStartingCash()
        // compare starting cash
        if (starting_cash < minStartingCash || starting_cash > maxStartingCash) returnErrorResponse(ERROR_MESSAGES.STARTING_CASH_ERROR)
        // check capacity
        if (type === COMPETITION_TYPE.GROUP && !is_default) {
            const capacityFeeToBeDebited = capacity * capacityFee
            if (capacityFeeToBeDebited > user.trek_coin_balance) {
                // show owner his trek coins balance capacity
                const yourTrekCoinsCapacity = user.trek_coin_balance / capacityFee;
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
        await this.joinCompetition(user, competition)
        // invite participants
        if (participants && participants.length && type === COMPETITION_TYPE.GROUP) {
            for (const email of participants) {
                const participant = await this.findOrCreateParticipant(competition.id, email)
                this.inviteParticipant(participant, competition, user)
            }
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

    async findOne(filter: {}): Promise<CompetitionDocument | undefined> {
        return this.competitionModel.findOne(filter)
    }

    async findOrCreateParticipant(competitionId: Types.ObjectId, participantEmail: string, ownerId: Types.ObjectId = null) {
        return await this.participantModel.findOne({
            email: participantEmail,
            competition: competitionId
        }) ?? await this.participantModel.create({
            participant: ownerId,
            competition: competitionId,
            email: participantEmail,
            is_owner: !!ownerId
        })
    }


    async joinCompetition(user: UserDocument, competition: CompetitionDocument): Promise<boolean> {
        const m = await this.participantModel.findOneAndUpdate({competition: competition.id, email: user.email}, {
            $set: {
                joined: true,
                participant: user.id,
                starting_cash: competition.starting_cash
            }
        },)
        if (!m) returnErrorResponse(ERROR_MESSAGES.COMPETITION_REQUEST_NOT_FOUND)
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

    getMinAndMaxStartingCash(): { minStartingCash: number, maxStartingCash: number, capacityFee: number } {
        return {
            minStartingCash: parseInt(this.configService.get('MIN_STARTING_CASH')),
            maxStartingCash: parseInt(this.configService.get('MAX_STARTING_CASH')),
            capacityFee: parseInt(this.configService.get('CAPACITY_FEE'))
        }
    }

    async inviteParticipant(participant: ParticipantDocument, competition: CompetitionDocument, owner: UserDocument) {
        if (participant.participant) {
            // participant is a user on trades trek
            await this.queueService.sendEmail({
                to: participant.email,
                template: '/CompetitionInvite',
                context: {competition, owner},
                subject: EMAIL_SUBJECTS.COMPETITION_INVITATION
            })
            await onesignalService.sendPushNotification(participant.participant, EMAIL_SUBJECTS.COMPETITION_INVITATION, `You have been invited to join ${competition.name}`, {})
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

    async getParticipants(competitionId: Types.ObjectId, loadParticipants: boolean = false): Promise<Participant[]> {
        return loadParticipants ? await this.participantModel.find({competition: competitionId}).populate('participant') : await this.participantModel.find({competition: competitionId})
    }

    async join(competitionId: Types.ObjectId, user: UserDocument, joinCompetitionDto: JoinCompetitionDto) {
        const competition = await this.findOne({'_id': competitionId})
        if (!competition) returnErrorResponse('Competition not found')
        // check if late entry is allowed
        if (!competition.allow_late_entry && competition.status === COMPETITION_STATUS.ONGOING) returnErrorResponse('You cannot join this competition after it has started')

        if (competition.entry === COMPETITION_ENTRY.CLOSED) {
            // compare password
            if (competition.password !== joinCompetitionDto.password) returnErrorResponse('Invalid competition password')
        }
        await this.joinCompetition(user, competition);
        return successResponse('joined successfully')
    }

    async resetPortfolio(competitionId:Types.ObjectId, user:UserDocument){

    }

    async getTotalStartingCash(userId:Types.ObjectId):Promise<number>{
        const totalStartingCash = await this.participantModel.aggregate([
            { $match: { participant: userId } },
            { $group: { _id: null, starting_cash: { $sum: "$starting_cash" } } }
        ]).exec()
        return totalStartingCash[0].starting_cash;
    }


}
