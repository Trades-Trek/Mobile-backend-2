import {Global, Module} from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Plan, PlanSchema} from "./schemas/plan.schema";
import {PlanFeature, PlanFeatureSchema} from "./schemas/plan_features.schema";
@Global()
@Module({
  imports:[MongooseModule.forFeature([{name: Plan.name, schema: PlanSchema}, {name:PlanFeature.name, schema:PlanFeatureSchema}])],
  controllers: [PlansController],
  providers: [PlansService],
  exports:[PlansService]
})
export class PlansModule {}
