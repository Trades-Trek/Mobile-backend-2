import {Injectable} from '@nestjs/common';
import {CreatePlanDto} from './dto/create-plan.dto';
import {UpdatePlanDto} from './dto/update-plan.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Plan, PlanDocument, PlanSchema} from "./schemas/plan.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {FeaturesService} from "../features/features.service";
import {PlanFeature} from "./schemas/plan_features.schema";

@Injectable()
export class PlansService {
    constructor(@InjectModel(Plan.name) private planModel: Model<Plan>, @InjectModel(PlanFeature.name) private planFeatureModel: Model<PlanFeature>, private featureService: FeaturesService) {
    }

    async createOrUpdatePlan(createPlanDto: CreatePlanDto, planId?: Types.ObjectId) {
        const plan = planId ? await this.planModel.findById(planId) : await this.planModel.create(createPlanDto);
        for (const feature of createPlanDto.features) {
            if (!await this.planFeatureModel.findOne({feature})) {
                await this.planFeatureModel.create({plan: plan.id, feature})
            }
        }
        return successResponse({plan, message: 'plan created successfully'})
    }


    async findAll() {
        const plans = await this.planModel.find();
        return successResponse({plans})
    }

    async getPlanFeatures(planId: Types.ObjectId) {
        const id = planId.toHexString()
        let planFeatures = await this.featureService.loadFeaturesFromCache(`plan_features_${id}`)
        if (!planFeatures) {
            console.log('no cache')
            planFeatures = await this.planFeatureModel.find({plan: id}).populate('feature');
            this.featureService.addFeaturesToCache(`plan_features_${id}`, planFeatures)
        }
        return planFeatures

    }

    async findOne(id: Types.ObjectId): Promise<PlanDocument | undefined> {
        return this.planModel.findById(id);
    }


}
