import {Injectable} from '@nestjs/common';
import {CreatePlanDto} from './dto/create-plan.dto';
import {UpdatePlanDto} from './dto/update-plan.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Plan, PlanSchema} from "./schemas/plan.schema";
import {Model} from "mongoose";
import {successResponse} from "../utils/response";

@Injectable()
export class PlansService {
    constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {
    }

    async create(createPlanDto: CreatePlanDto) {
        const plan = await this.planModel.create(createPlanDto);
        return successResponse({plan, message: 'plan created successfully'})
    }

    async findAll() {
        const plans = await this.planModel.find().exec();
        return successResponse({plans})
    }

    async findOne(id: number) {
        return `This action returns a #${id} plan`;
    }

    update(id: number, updatePlanDto: UpdatePlanDto) {
        return `This action updates a #${id} plan`;
    }

    remove(id: number) {
        return `This action removes a #${id} plan`;
    }
}
