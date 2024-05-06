import {Injectable} from "@nestjs/common";
import {UserDocument} from "../../users/schemas/user.schema";
import {Model, Types} from "mongoose";
import {CompetitionsService} from "./competitions.service";
import {OrdersService} from "../../orders/orders.service";
import {StockPriceService} from "../../stock/services/stock_price.service";
import {InjectModel} from "@nestjs/mongoose";
import {AccountValue} from "../schemas/account-value.schema";

@Injectable()
export class AccountValueService {
    constructor(private competitionService: CompetitionsService, private orderService: OrdersService, private stockPriceService: StockPriceService, @InjectModel(AccountValue.name) private accountValueModel: Model<AccountValue>) {
    }

    async getAccountAndCashValue(user: UserDocument): Promise<{ accountValue: number, cashValue: number }> {
        let latestAccountValue = 0;
        // retrieve total starting cash
        const cashValue = await this.competitionService.getTotalStartingCash(user.id);

        latestAccountValue += cashValue
        // retrieve user stocks
        const userStocks = await this.orderService.getUserStocks(user)

        if (userStocks && userStocks.length > 0) {
            for (const stock of userStocks) {
                const stockPrice = await this.stockPriceService.findStockPrice({symbol: stock.stock_symbol})
                latestAccountValue += stockPrice.last
            }
            const previousAccountValue = await this.getPreviousAccountValue(user)
            if (latestAccountValue !== previousAccountValue) this.createNewAccountValue(user.id, latestAccountValue)
        }
        return {accountValue: latestAccountValue, cashValue};
    }

    async getTodayPercentageChange(user: UserDocument): Promise<number> {
        const previousAccountValue = await this.getPreviousAccountValue(user) ?? 0
        const {accountValue:latestAccountValue} = await this.getAccountAndCashValue(user)
        const increaseOrDecrease = previousAccountValue - latestAccountValue
        return (increaseOrDecrease / previousAccountValue) * 100
    }

    async createNewAccountValue(userId: Types.ObjectId, value) {
        return await this.accountValueModel.create({user: userId, value})
    }

    async getPreviousAccountValue(user: UserDocument): Promise<number> {
        const accountValue = await this.accountValueModel.findOne({user: user.id}).sort({created_at: -1}).exec();
        return accountValue ? accountValue.value : 0
    }
}