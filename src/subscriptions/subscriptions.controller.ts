<<<<<<< Updated upstream
import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service';
import {CreateSubscriptionDto} from './dto/create-subscription.dto';
import {UpdateSubscriptionDto} from './dto/update-subscription.dto';
import {Types} from "mongoose";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
=======
import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service';
import {Types} from "mongoose";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
>>>>>>> Stashed changes

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {
    }

<<<<<<< Updated upstream
=======
    @ApiOperation({summary: "Subscribe"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
>>>>>>> Stashed changes
    @Post('/subscribe/:plan_id')
    create(@Param('plan_id') planId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.subscriptionsService.subscribe(user, planId);
    }

<<<<<<< Updated upstream
=======
    @ApiOperation({summary: "Renew Subscription"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
>>>>>>> Stashed changes
    @Post('/renew')
    renew(@AuthUser() user: UserDocument) {
        return this.subscriptionsService.renew(user);
    }


}
