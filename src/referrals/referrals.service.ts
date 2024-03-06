import {Injectable} from '@nestjs/common';
import {ReferralDto} from './dto/referral.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Referral, ReferralDocument} from "./schemas/referral.schema";
import {Model} from "mongoose";
import {UserDocument} from "../users/schemas/user.schema";
import {QueueService} from "../queues/queue.service";
import {successResponse} from "../utils/response";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ConfigService} from "@nestjs/config";
import {WalletService} from "../wallet/wallet.service";
import {NotificationsService} from "../notifications/notifications.service";

@Injectable()
export class ReferralsService {
    constructor(@InjectModel(Referral.name) private referralModel: Model<Referral>, private queueService: QueueService, private configService: ConfigService, private walletService: WalletService, private notificationService: NotificationsService) {
    }

    async findOrCreate(email: string, referrer: UserDocument) {
        return await this.referralModel.findOne({email}) ?? await this.referralModel.create({
            email,
            referrer,
            referrer_id: referrer.id
        })

    }

    async referAFriend(referrer: UserDocument, referralDto: ReferralDto) {
        const referral = await this.findOrCreate(referralDto.email, referrer)
        // send invite via mail
        await this.queueService.sendEmail({
            to: referral.email,
            subject: 'Referral Invite',
            context: {
                code: referrer.referral_code,
                referrer_full_name: referrer.full_name,
                referred_email: referralDto.email
            },
            template: '/ReferralInvite'
        })
        return successResponse(SUCCESS_MESSAGES.REFER_A_FRIEND_SUCCESS)
    }

    async findAll(user: UserDocument) {
        const totalPending = await this.referralModel.countDocuments({referrer_id: user.id, joined: false})
        const totalCompleted = await this.referralModel.countDocuments({referrer_id: user.id, joined: true})
        const totalEarning = await this.referralModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount_earned"
                    }
                }
            }
        ])
        const referrals = await this.referralModel.find({referrer_id: user.id})
        return successResponse({
            total_pending: totalPending,
            total_completed: totalCompleted,
            total_earning: totalEarning[0].total,
            referrals
        })

    }

    async reward(referrer: UserDocument, referral: ReferralDocument): Promise<void> {
        const amountEarned = parseInt(this.configService.get('REFERRAL_REWARD'))
        await referral.updateOne({joined: true, amount_earned: amountEarned})
        // credit referrer's trek coins with amount earned
        await this.walletService.creditUserTrekCoins(referrer, amountEarned)
        await this.notificationService.create({
            title: SUCCESS_MESSAGES.REFERRAL_REWARD_TITLE,
            description: SUCCESS_MESSAGES.REFERRAL_REWARD_DESCRIPTION,
            user_id: referrer.id
        })

    }


}
