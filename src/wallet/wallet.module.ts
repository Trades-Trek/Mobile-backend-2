import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {BanksModule} from "../banks/banks.module";
import {BanksService} from "../banks/banks.service";

@Module({
  imports:[BanksModule],
  controllers: [WalletController],
  providers: [WalletService, BanksService],
  exports:[WalletService]
})
export class WalletModule {}
