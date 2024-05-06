import {Module} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {OrdersController} from './orders.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Order, OrderSchema} from "./schemas/order.schema";
import {CompetitionsModule} from "../competitions/competitions.module";
import {WalletModule} from "../wallet/wallet.module";
import {AccountValue, AccountValueSchema} from "./schemas/account-value.schema";

@Module({
    imports: [WalletModule,CompetitionsModule, MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}, {name:AccountValue.name, schema:AccountValueSchema}])],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService]
})
export class OrdersModule {
}
