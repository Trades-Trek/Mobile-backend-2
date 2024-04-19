import {Injectable} from '@nestjs/common';
import {StockPrice} from "../entities/stock_prices.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {successResponse} from "../../utils/response";
import {Company} from "../entities/companies.entity";

@Injectable()
export class CompanyService {
    constructor(@InjectRepository(Company)
                private companyRepository: Repository<Company>) {
    }


    async findAll() {
        const companies = await this.companyRepository.find();
        return successResponse({companies})
    }

    async findCompany(filter: any, columnsToLoad?: Array<string>): Promise<Company | undefined> {
        let columns_to_load;
        columns_to_load = columns_to_load && columnsToLoad.length ? columnsToLoad : ['id', 'name', 'ticker_symbol']
        return await this.companyRepository.findOne({where: filter, select: columns_to_load});
    }

}
