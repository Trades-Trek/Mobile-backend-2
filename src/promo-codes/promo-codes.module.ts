import {Global, Module} from '@nestjs/common';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodesController } from './promo-codes.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {PromoCode, PromoCodeSchema} from "./schemas/promo-code.schema";

@Global()
@Module({
  imports:[MongooseModule.forFeature([{name:PromoCode.name, schema:PromoCodeSchema}])],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
})
export class PromoCodesModule {}
