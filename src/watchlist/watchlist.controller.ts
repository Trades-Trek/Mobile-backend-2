import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Types} from "mongoose";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post(':stock_price_symbol')
  create(@Param('stock_price_symbol') stockPriceSymbol: string, @AuthUser() user: UserDocument) {
    return this.watchlistService.create(stockPriceSymbol,user);
  }

  @Post('/price-alert/:watchlist_id')
  priceAlert(@Param('watchlist_id') watchlistId: string, @AuthUser() user: UserDocument) {
    return this.watchlistService.setPriceAlert(watchlistId,user);
  }
  @Get()
  findAll(@AuthUser() user:UserDocument,@GetPagination() pagination: Pagination) {
    return this.watchlistService.findAll(user, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchlistService.findOne(+id);
  }


  @Delete(':watchlist_id')
  remove(@Param('watchlist_id') id: Types.ObjectId) {
    return this.watchlistService.remove(id);
  }
}
