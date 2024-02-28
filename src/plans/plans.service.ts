import {Injectable} from '@nestjs/common';
import {CreatePlanDto} from './dto/create-plan.dto';
import {UpdatePlanDto} from './dto/update-plan.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Plan, PlanDocument, PlanSchema} from "./schemas/plan.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {UserDocument} from "../users/schemas/user.schema";
import {AuthUser} from "../decorators/user.decorator";

@Injectable()
export class PlansService {
    constructor(@InjectModel(Plan.name) private planModel: Model<Plan>) {
    }

    async create(createPlanDto: CreatePlanDto) {
        const plan = await this.planModel.create(createPlanDto);
        return successResponse({plan, message: 'plan created successfully'})
    }


    async findAll() {
        const plans = await this.planModel.find();
        return successResponse({plans})
    }

    async findOne(id: Types.ObjectId): Promise<PlanDocument | undefined> {
        return this.planModel.findById(id);
    }

    update(id: number, updatePlanDto: UpdatePlanDto) {
        return `This action updates a #${id} plan`;
    }

    remove(id: number) {
        return `This action removes a #${id} plan`;
    }
}
