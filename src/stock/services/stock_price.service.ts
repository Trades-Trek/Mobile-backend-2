import {Injectable} from '@nestjs/common';

import {StockPrice} from "../entities/stock_prices.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {successResponse} from "../../utils/response";

@Injectable()
export class StockPriceService {
    constructor(@InjectRepository(StockPrice)
                private stockPriceRepository: Repository<StockPrice>) {
    }


    async findAll() {
        const stockPrices = await this.stockPriceRepository.find();
        return successResponse({stock_prices:stockPrices})
    }

    async findStockPrice(filter: any, columnsToLoad: [string]): Promise<StockPrice> {
        let columns_to_load;
        columns_to_load = columnsToLoad.length ? columnsToLoad : ['company_id', 'id']
            return await this.stockPriceRepository.findOne({where: filter, select: columns_to_load});
    }

}
