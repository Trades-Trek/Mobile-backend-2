import {Global, Module} from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Transaction, TransactionSchema} from "./schemas/transaction.schema";
<<<<<<< Updated upstream
=======
import {TransactionsController} from "./transactions.controller";
>>>>>>> Stashed changes

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}])],
<<<<<<< Updated upstream
=======
    controllers:[TransactionsController],
>>>>>>> Stashed changes
    providers: [TransactionsService],
    exports:[TransactionsService]
})
export class TransactionsModule {
}
