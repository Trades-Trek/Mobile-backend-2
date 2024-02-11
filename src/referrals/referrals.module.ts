import {Global, Module} from '@nestjs/common';
import {ReferralsService} from './referrals.service';
import {ReferralsController} from './referrals.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Referral, RefferalSchema} from "./schemas/referral.schema";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Referral.name, schema: RefferalSchema}])],
    controllers: [ReferralsController],
    providers: [ReferralsService],
    exports:[ReferralsService]
})
export class ReferralsModule {
}
