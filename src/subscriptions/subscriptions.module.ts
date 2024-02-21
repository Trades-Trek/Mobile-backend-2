import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SubscriptionHistory, SubscriptionHistorySchema} from "./schemas/subscription-history.schema";

@Module({
  imports:[MongooseModule.forFeature([{name:SubscriptionHistory.name, schema:SubscriptionHistorySchema}])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
