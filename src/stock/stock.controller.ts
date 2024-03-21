import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockPriceService } from './services/stock_price.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import {Public} from "../decorators/public-endpoint.decorator";
@Public()
@Controller('stock-prices')
export class StockController {
  constructor(private readonly stockPriceService: StockPriceService) {}


  @Get()
  findAll() {
    return this.stockPriceService.findAll();
  }

}
