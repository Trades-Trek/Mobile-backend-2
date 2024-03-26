import {Injectable} from '@nestjs/common';
import {CreateCompetitionDto} from './dto/create-competition.dto';
import {UpdateCompetitionDto} from './dto/update-competition.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {InjectModel} from "@nestjs/mongoose";
import {Competition} from "./schemas/competition.schema";
import {Model, Types} from "mongoose";
import {Pagination} from "../enums/pagination.enum";
import {UserDocument} from "../users/schemas/user.schema";
import {returnErrorResponse, successResponse} from "../utils/response";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ERROR_MESSAGES} from "../enums/error-messages";

@Injectable()
export class CompetitionsService {
    constructor(@InjectModel(Competition.name) private competitionModel: Model<Competition>) {
    }

    async create(user: UserDocument, createCompetitionDto: CreateCompetitionDto) {
        createCompetitionDto['owner'] = user.id
        const competition = await this.competitionModel.create(createCompetitionDto)
        return successResponse({competition, message: SUCCESS_MESSAGES.COMPETITION_CREATED})
    }

    async findAll(user: UserDocument, pagination: Pagination) {
        const myCompetitions = await this.competitionModel.find({owner: user.id}).limit(pagination.limit).skip(pagination.page);
        return successResponse({my_competitions: myCompetitions})
    }

    async findOne(competitionId: Types.ObjectId): Promise<Competition | undefined> {
        return this.competitionModel.findById(competitionId)
    }

    update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
        return `This action updates a #${id} competition`;
    }

    async remove(competitionId: Types.ObjectId, user: UserDocument) {
        const competition = await this.competitionModel.findOne({'_id': competitionId, owner: user.id})
        if (!competition) returnErrorResponse(ERROR_MESSAGES.COMPETITION_NOT_FOUND)
        await competition.deleteOne()
        return successResponse(SUCCESS_MESSAGES.COMPETITION_DELETED)
    }
}
