import {Global, Module} from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Transaction, TransactionSchema} from "./schemas/transaction.schema";
import {TransactionsController} from "./transactions.controller";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}])],
    controllers:[TransactionsController],
    providers: [TransactionsService],
    exports:[TransactionsService]
})
export class TransactionsModule {
}
