import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {ReferralsModule} from "../referrals/referrals.module";
import {ReferralsService} from "../referrals/referrals.service";

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  exports:[WalletService]
})
export class WalletModule {}
