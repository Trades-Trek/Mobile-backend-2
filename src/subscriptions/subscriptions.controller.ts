import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service';
import {CreateSubscriptionDto} from './dto/create-subscription.dto';
import {UpdateSubscriptionDto} from './dto/update-subscription.dto';
import {Types} from "mongoose";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {
    }

    @Post('/subscribe/:plan_id')
    create(@Param('plan_id') planId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.subscriptionsService.subscribe(user, planId);
    }

    @Post('/renew')
    renew(@AuthUser() user: UserDocument) {
        return this.subscriptionsService.renew(user);
    }


}
