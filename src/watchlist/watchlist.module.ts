import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Watchlist, WatchListSchema} from "./schemas/watchlist.schema";

@Module({
  imports:[MongooseModule.forFeature([{name:Watchlist.name, schema:WatchListSchema}])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports:[WatchlistService]
})
export class WatchlistModule {}
