<<<<<<< Updated upstream
import {Injectable} from '@nestjs/common';
=======
import {HttpStatus, Injectable, Post, Body, forwardRef, Inject} from '@nestjs/common';
>>>>>>> Stashed changes
import {CreateTransactionDto} from './dto/create-transaction.dto';
import {UpdateTransactionDto} from './dto/update-transaction.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Transaction} from "./schemas/transaction.schema";
import {Model} from "mongoose";
<<<<<<< Updated upstream

@Injectable()
export class TransactionsService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {
=======
import {PAYSTACK_WEBHOOK_EVENTS} from "../enums/paystack_events";
import {UsersService} from "../users/users.service";
import {USER} from "../users/enums/user.enum";
import {UserDocument} from "../users/schemas/user.schema";
import {InitializeTransactionDto} from "./dto/intialise.dto";
import {successResponse} from "../utils/response";
const logger = require('../utils/logger');
import usePaystackService from "../services/paystack";
import {VerifyTransactionDto} from "./dto/verify.dto";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ERROR_MESSAGES} from "../enums/error-messages";

@Injectable()
export class TransactionsService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>, @Inject(forwardRef(() => UsersService)) private userService: UsersService) {
>>>>>>> Stashed changes
    }

    async create(createTransactionDto: CreateTransactionDto): Promise<void> {
        await this.transactionModel.create(createTransactionDto)
    }

<<<<<<< Updated upstream
    findAll() {
        return `This action returns all transactions`;
    }

    findOne(id: number) {
        return `This action returns a #${id} transaction`;
=======
    async paystackWebhookHandler(payload: any) {
        switch (payload.event) {
            case PAYSTACK_WEBHOOK_EVENTS.CHARGE_SUCCESS:
                this.handleDeposit(payload.data)
                break;
            case PAYSTACK_WEBHOOK_EVENTS.TRANSFER_SUCCESS:
                // handle transfer success
                break;
            case PAYSTACK_WEBHOOK_EVENTS.TRANSFER_FAILED:
            // handle failed transfer
            case PAYSTACK_WEBHOOK_EVENTS.TRANSFER_REVERSED:
                // handle reversed transfer
                break;
            default:
                console.log('hmmhmhhmhmhmhmhmhmhm')
        }
    }

    async handleDeposit(data: any): Promise<void> {
        const userId = data.metadata.user_id;
        const amount_paid = data.metadata.amount_paid;
        const paystackAmount = data.amount;
        // find user and credit his/her wallet
        const user: UserDocument | undefined = await this.userService.findOne({
            field: USER.ID,
            data: userId,
            is_server_request: true
        })
        if (user) this.userService.creditUserWallet(user, amount_paid)
        logger.info('Credited user successfully added')
    }

    async initializeTransaction(initializeTransactionDto: InitializeTransactionDto) {
        const {email, payment_channels, metadata, amount} = initializeTransactionDto;
        return successResponse(await usePaystackService.initializeTransaction(email, amount, metadata, payment_channels))
    }

    async verifyTransaction(verifyTransactionDto: VerifyTransactionDto) {
        const verified = await usePaystackService.verifyTransaction(verifyTransactionDto.payment_reference)
        const message = verified ? SUCCESS_MESSAGES.VERIFIED_TRANSACTION : ERROR_MESSAGES.UNVERIFIED_TRANSACTION;
        return successResponse({verified, message})
>>>>>>> Stashed changes
    }

}
