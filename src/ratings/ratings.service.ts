import {Injectable} from '@nestjs/common';
import {CreateRatingDto} from './dto/create-rating.dto';
import {UpdateRatingDto} from './dto/update-rating.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Rating} from "./schemas/rating.schema";
import {Model, Types} from "mongoose";
import {successResponse} from "../utils/response";
import {UserDocument} from "../users/schemas/user.schema";
import {ConfigService} from "@nestjs/config";
import {NotificationsService} from "../notifications/notifications.service";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {WalletService} from "../wallet/wallet.service";
import {Pagination} from "../enums/pagination.enum";

@Injectable()
export class RatingsService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>, private configService: ConfigService, private notificationService: NotificationsService, private walletService: WalletService) {
    }

    async create(user: UserDocument, createRatingDto: CreateRatingDto) {
        createRatingDto['user'] = user.id;
        await this.ratingModel.create(createRatingDto)
        const rewardUserRating = parseInt(this.configService.get('REWARD_USERS_RATING'));
        if (rewardUserRating) this.reward(user)
        return successResponse('Rating feedback submitted successfully');
    }

    async findAll(user: UserDocument, paginationParameters: Pagination) {
        const ratings = await this.ratingModel.find({user: user.id});
        console.log(paginationParameters)
        const {totalRating, ratingCount} = await this.getUserRating(user.id)
        return successResponse({ratings, total_rating: totalRating, rating_count: ratingCount})
    }

    async getUserRating(userId: Types.ObjectId): Promise<{ totalRating: number, ratingCount: number }> {
        let totalRating = 0;
        const ratingCount = await this.ratingModel.countDocuments({user: userId})
        const ratingSum = await this.ratingModel.aggregate([
            {
                $match: {
                    'user': userId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$star"
                    }
                }
            },
        ])
        totalRating = ratingSum[0].total ? Math.round(ratingSum[0].total / ratingCount) : 0;
        return {totalRating, ratingCount};
    }

    async reward(user: UserDocument): Promise<void> {
        const rewardBonus = parseInt(this.configService.get('RATING_REWARD'))
        await this.walletService.creditUserTrekCoins(user, rewardBonus)
        await this.notificationService.create({
            title: SUCCESS_MESSAGES.RATING_REWARD_TITLE,
            description: SUCCESS_MESSAGES.RATING_REWARD_DESCRIPTION,
            user_id: user.id,
            priority: true
        })
    }

}
