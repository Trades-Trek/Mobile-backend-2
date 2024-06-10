import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import {AuthModule} from "../auth/auth.module";
import {WatchlistModule} from "../watchlist/watchlist.module";

@Module({
  imports:[AuthModule, WatchlistModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
