import {Injectable} from '@nestjs/common';
import {UserDocument} from "../users/schemas/user.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {PlansService} from "../plans/plans.service";
import {PlanDocument} from "../plans/schemas/plan.schema";
import useDayJs from '../services/dayjs'
import {PLAN_TYPE} from "../enums/plan_type";
import {AuthUser} from "../decorators/user.decorator";
import {UsersService} from "../users/users.service";
import {TransactionsService} from "../transactions/transactions.service";
import {InjectModel} from "@nestjs/mongoose";
import {SubscriptionHistory} from "./schemas/subscription-history.schema";
import {NotificationsService} from "../notifications/notifications.service";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {WalletService} from "../wallet/wallet.service";

@Injectable()
export class SubscriptionsService {
    constructor(private planService: PlansService, private userService: UsersService, private transactionService: TransactionsService, @InjectModel(SubscriptionHistory.name) private subscriptionsHistoryModel: Model<SubscriptionHistory>, private notificationService: NotificationsService, private walletService: WalletService) {
    }


    async subscribe(user: UserDocument, planId: Types.ObjectId) {
        const plan: PlanDocument | undefined = await this.planService.findOne(planId)
        if (!plan) returnErrorResponse('plan does not exist');
        const userSub = user.subscription;
        // check if user has already subscribed to this plan
        if (user.has_subscribed) {
            if (userSub.plan_id === planId) returnErrorResponse(ERROR_MESSAGES.SUBSCRIBED)
            if (userSub.plan_type === PLAN_TYPE.PAID && !userSub.has_expired) returnErrorResponse(ERROR_MESSAGES.PAID_PLAN_ACTIVE)
        }
        // check if user has enough funds in his/her trek coin balance
        const planAmountInTrekCoins = this.walletService.convertToTrekCoins(plan.amount)
        if (user.trek_coin_balance < planAmountInTrekCoins && plan.type === PLAN_TYPE.PAID) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_TREK_COINS_BALANCE)
        // subscribe user to this plan
        await this.renewSubscription(user, plan)
        // dispatch event
        return successResponse('subscription successful')
    }

    async renew(@AuthUser() user: UserDocument) {
        if (!user.has_subscribed) returnErrorResponse(ERROR_MESSAGES.NO_SUBSCRIPTION)
        const userSub = user.subscription;
        if (!userSub.has_expired) returnErrorResponse(ERROR_MESSAGES.SUBSCRIPTION_EXPIRED)
        const plan: PlanDocument | undefined = await this.planService.findOne(userSub.plan_id)
        const planAmountInTrekCoins = this.walletService.convertToTrekCoins(plan.amount)
        if (user.trek_coin_balance < planAmountInTrekCoins) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_TREK_COINS_BALANCE)
        // renew plan
        await this.renewSubscription(user, plan)
        // dispatch event
        return successResponse('Subscription renewed successfully')
    }


    async renewSubscription(user: UserDocument, plan: PlanDocument): Promise<boolean> {
        const today = useDayJs.getDate();
        const renewalDate = useDayJs.addDays(today, plan.no_of_days)
        const trekCoins = this.walletService.convertToTrekCoins(plan.amount)
        await this.walletService.debitUserTrekCoins(user, trekCoins)
        await user.updateOne({
            subscription: {
                plan_id: plan.id,
                has_expired: false,
                renewal_date: renewalDate,
                plan_type: plan.type
            }
        });
        this.createSubscriptionHistory(user.id, plan.id, renewalDate)
        this.notificationService.create({
            user_id: user.id,
            title: 'Subscription Renewed Successfully',
            description: `Your ${plan.name} plan subscription has been renewed successfully`
        })
        return true;
    }

    async createSubscriptionHistory(user_id: Types.ObjectId, plan_id: Types.ObjectId, expire_at: Date): Promise<SubscriptionHistory> {
        return await this.subscriptionsHistoryModel.create({expire_at, plan_id, user_id})
    }
}
