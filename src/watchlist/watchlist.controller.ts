import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post(':stock_price_symbol')
  create(@Param('stock_price_symbol') stockPriceSymbol: string) {
    return this.watchlistService.create(stockPriceSymbol);
  }

  @Get()
  findAll() {
    return this.watchlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchlistService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchlistService.remove(+id);
  }
}
