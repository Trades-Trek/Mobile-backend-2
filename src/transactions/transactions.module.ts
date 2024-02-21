import {Global, Module} from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Transaction, TransactionSchema} from "./schemas/transaction.schema";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}])],
    providers: [TransactionsService],
    exports:[TransactionsService]
})
export class TransactionsModule {
}
