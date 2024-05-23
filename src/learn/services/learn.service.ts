import {Injectable} from '@nestjs/common';
import {CreateLearnDto} from '../dto/create-learn.dto';
import {UpdateLearnDto} from '../dto/update-learn.dto';
import {InjectModel} from "@nestjs/mongoose";
import {LearnResources} from "../schemas/learn_resources.schema";
import {Model, Types} from "mongoose";
import {successResponse} from "../../utils/response";
import {SUCCESS_MESSAGES} from "../../enums/success-messages";
import {Pagination} from "../../enums/pagination.enum";

@Injectable()
export class LearnService {
    constructor(@InjectModel(LearnResources.name) private learnModel: Model<LearnResources>) {
    }

    async create(createLearnDto: CreateLearnDto) {
        const copy = JSON.parse(JSON.stringify(createLearnDto));
        delete createLearnDto.quizzes;
        delete createLearnDto.tags;
        const learn = await this.learnModel.create(createLearnDto)
        for (const quiz of copy.quizzes) learn.quizzes.push(quiz)
        for (const tag of copy.tags) learn.tags.push(tag)
        await learn.save();
        return successResponse(SUCCESS_MESSAGES.LEARN_RESOURCE_CREATED)
    }

    async findAll(categoryId?: Types.ObjectId, pagination?: Pagination) {
        let filter = {};
        if (categoryId) filter = {category_id: categoryId}
        const learnResources = await this.learnModel.find(filter).skip(pagination.page).limit(pagination.limit)
        return successResponse({learn_resources: learnResources})

    }

    findOne(id: number) {
        return `This action returns a #${id} learn`;
    }

    update(id: number, updateLearnDto: UpdateLearnDto) {
        return `This action updates a #${id} learn`;
    }

    async remove(id: number) {
        return `This action removes a #${id} learn`;
    }
}
