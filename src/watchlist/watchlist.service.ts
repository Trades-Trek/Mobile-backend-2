import {Injectable} from '@nestjs/common';
import {CreateWatchlistDto} from './dto/create-watchlist.dto';
import {UpdateWatchlistDto} from './dto/update-watchlist.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Watchlist} from "./schemas/watchlist.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {PaginationDto, PaginationParams} from "../decorators/pagination.decorator";
import {StockPriceService} from "../stock/services/stock_price.service";

@Injectable()
export class WatchlistService {
    constructor(@InjectModel(Watchlist.name) private watchlistModel: Model<Watchlist>, private stockPriceService: StockPriceService) {

    }

    async create(stockPriceSymbol: string, @AuthUser() user?: UserDocument) {
        console.log(user)
        if (await this.findOne({stock_price_symbol: stockPriceSymbol})) returnErrorResponse(ERROR_MESSAGES.ALREADY_EXIST_IN_WATCH_LIST)
        // check if stock price does exist
        if (!await this.stockPriceService.findStockPrice({symbol: stockPriceSymbol}, ['symbol']))
            returnErrorResponse('Stock price does not exist')
        // add to watch list
        const watchList = await this.watchlistModel.create({stock_price_symbol: stockPriceSymbol, user: user.id})
        return successResponse({watch_list: watchList, message: SUCCESS_MESSAGES.STOCK_PRICE_ADDED_TO_WATCHLIST})
    }

    async findAll(@AuthUser() user?: UserDocument, @PaginationParams() paginationParams?: PaginationDto) {
        const watchLists = await this.watchlistModel.find({user}, {}, {
            limit: paginationParams.limit,
            skip: paginationParams.page
        })
        return successResponse({my_watch_lists: watchLists})
    }

    async findOne(filter: Object): Promise<Watchlist | undefined> {
        return this.watchlistModel.findOne(filter);
    }

    remove(id: number) {
        return `This action removes a #${id} watchlist`;
    }
}
