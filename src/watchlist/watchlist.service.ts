import {Injectable} from '@nestjs/common';
import {CreateWatchlistDto} from './dto/create-watchlist.dto';
import {UpdateWatchlistDto} from './dto/update-watchlist.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Watchlist} from "./schemas/watchlist.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {StockPriceService} from "../stock/services/stock_price.service";
import {Pagination} from "../enums/pagination.enum";

@Injectable()
export class WatchlistService {
    constructor(@InjectModel(Watchlist.name) private watchlistModel: Model<Watchlist>, private stockPriceService: StockPriceService) {

    }

    async create(stockPriceSymbol: string, user: UserDocument) {
        if (await this.findOne({
            stock_price_symbol: stockPriceSymbol,
            user: user.id
        })) returnErrorResponse(ERROR_MESSAGES.ALREADY_EXIST_IN_WATCH_LIST)
        // check if stock price does exist
        const stockPrice = await this.stockPriceService.findStockPrice({symbol: stockPriceSymbol}, ['symbol', 'last']);
        if (!stockPrice) returnErrorResponse('Stock price does not exist')
        // add to watch list
        const watchList = await this.watchlistModel.create({
            stock_price_symbol: stockPriceSymbol,
            user: user.id,
            price: stockPrice.last
        })
        return successResponse({watch_list: watchList, message: SUCCESS_MESSAGES.STOCK_PRICE_ADDED_TO_WATCHLIST})
    }

    async setPriceAlert(watchlistId: string, user: UserDocument) {
        let watchlist = await this.watchlistModel.findById(watchlistId)
        if (!watchlist) returnErrorResponse(ERROR_MESSAGES.WATCHLIST_NOT_FOUND)
        if (watchlist.user !== user.id) returnErrorResponse('Unauthorised')
        // update watch list
        watchlist = await this.watchlistModel.findByIdAndUpdate(watchlistId, {price_alert: !watchlist.price_alert}, {new: true})
        return successResponse({watchlist, message: 'successful'})
    }

    async findAll(user: UserDocument, paginationParams: Pagination) {
        const watchLists = await this.watchlistModel.find({user}, {}, {
            limit: paginationParams.limit,
            skip: paginationParams.page
        })
        return successResponse({my_watch_lists: watchLists})
    }

    async findOne(filter: Object): Promise<Watchlist | undefined> {
        return this.watchlistModel.findOne(filter);
    }

    async remove(watchlistId: Types.ObjectId) {
        await this.watchlistModel.findByIdAndDelete(watchlistId)
        return successResponse(SUCCESS_MESSAGES.STOCK_PRICE_REMOVED_FROM_WATCHLIST)
    }
}
