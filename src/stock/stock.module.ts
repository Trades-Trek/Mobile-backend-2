import {Global, Module} from '@nestjs/common';
import { StockPriceService } from './services/stock_price.service';
import { StockController } from './stock.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockPrice} from "./entities/stock_prices.entity";
import {Company} from "./entities/companies.entity";

@Global()
@Module({
  imports:[TypeOrmModule.forFeature([Company, StockPrice])],
  controllers: [StockController],
  providers: [StockPriceService],
  exports:[StockPriceService]
})
export class StockModule {}