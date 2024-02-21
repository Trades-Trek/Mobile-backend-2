import {Injectable} from '@nestjs/common';
import {CreateTransactionDto} from './dto/create-transaction.dto';
import {UpdateTransactionDto} from './dto/update-transaction.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Transaction} from "./schemas/transaction.schema";
import {Model} from "mongoose";

@Injectable()
export class TransactionsService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {
    }

    async create(createTransactionDto: CreateTransactionDto): Promise<void> {
        await this.transactionModel.create(createTransactionDto)
    }

    findAll() {
        return `This action returns all transactions`;
    }

    findOne(id: number) {
        return `This action returns a #${id} transaction`;
    }

}
