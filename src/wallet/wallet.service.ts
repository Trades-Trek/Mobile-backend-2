import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {FundTrekCoinsDto} from './dto/wallet.dto';
import {UserDocument} from "../users/schemas/user.schema";
import {TRANSACTION_ENTITY, TRANSACTION_TYPE} from "../enums/transaction_type";
import {TransactionsService} from "../transactions/transactions.service";
import {NotificationsService} from "../notifications/notifications.service";
import {DEFAULT_CURRENCY} from "../utils/constant";
import {ConfigService} from "@nestjs/config";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {BankTransferDto} from "./dto/bank-transfer.dto";
import {BankDocument} from "../banks/schemas/bank.schema";
import {BanksService} from "../banks/banks.service";
import usePaystackService from '../services/paystack'
import {UsersService} from "../users/users.service";
import {USER} from "../users/enums/user.enum";
import {ReferralsService} from "../referrals/referrals.service";

@Injectable()
export class WalletService {
    constructor(@Inject(forwardRef(() => TransactionsService)) private transactionService: TransactionsService, private notificationService: NotificationsService, private configService: ConfigService, private bankService: BanksService, @Inject(forwardRef(() => UsersService)) private userService: UsersService, private referralService: ReferralsService) {
    }

    async transferToBankAccount(user: UserDocument, bankTransferDto: BankTransferDto): Promise<any> {
        const {account_number, amount, bank_code, bank_name} = bankTransferDto;
        if (user.wallet.balance < amount) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_WALLET_BALANCE)
        const bankAccount: BankDocument | undefined = await this.bankService.saveAndRetrieveBankAccount(user, account_number, bank_code, bank_name);
        // initiate transfer
        const transferResponse = await usePaystackService.initiateTransfer(amount, bankAccount.recipient_code)
        console.log(`Transer id - ${transferResponse.id}`);
        // debit user wallet
        await this.debitUserWallet(user, amount, false);
        // create transaction
        await this.transactionService.create({
            entity: TRANSACTION_ENTITY.WALLET,
            user_id: user.id,
            amount: amount,
            transfer_code: transferResponse.transfer_code,
            status: transferResponse.status,
            description: `Transfer From Your Wallet to ${bankAccount.account_name}`,
            type: TRANSACTION_TYPE.TRANSFER,
            reference: transferResponse.reference,
            wallet_balance_before_transaction:user.wallet.balance,
            trek_coin_balance_before_transaction:user.trek_coin_balance
        });
        return successResponse(SUCCESS_MESSAGES.TRANSFER_QUEUED)
    }

    async fundTrekCoinsViaWallet(user: UserDocument, fundTrekCoinsDto: FundTrekCoinsDto) {
        const {trek_coins} = fundTrekCoinsDto;
        const amountInCash = this.convertTrekCoinsToCash(trek_coins)
        if (user.wallet.balance < amountInCash) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_WALLET_BALANCE)
        await this.debitUserWallet(user, amountInCash)
        await this.creditUserTrekCoins(user, trek_coins)
        if (user.referrer_code && user.is_first_trek_coins_purchase) {
            // get referrer for reward
            const referrer = await this.userService.findOne({
                data: user.referrer_code,
                field: USER.REFERRAL_CODE,
                is_server_request: true
            })
            // get the logged referral
            const referral = await this.referralService.findOrCreate(user.email, referrer)
            if (referrer && referral) this.referralService.reward(referrer, referral)
            await user.updateOne({is_first_trek_coins_purchase: false})
        }
        const conversionRate = this.configService.get('TREK_COINS_CONVERSION_RATE_IN_NAIRA')
        return successResponse({message:SUCCESS_MESSAGES.TREK_COINS_FUNDED, conversion_rate:conversionRate, cash_converted:amountInCash })
    }

    async withdrawTrekCoins(user: UserDocument, fundTrekCoinsDto: FundTrekCoinsDto) {
        const {trek_coins} = fundTrekCoinsDto;
        if (user.trek_coin_balance < trek_coins) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_TREK_COINS_BALANCE)
        const amountInCash = this.convertTrekCoinsToCash(trek_coins)
        await this.debitUserTrekCoins(user, trek_coins)
        await this.creditUserWallet(user, amountInCash)
        return successResponse(SUCCESS_MESSAGES.TREK_COINS_FUNDED)
    }

    async creditUserTrekCoins(user: UserDocument, trekCoins: number): Promise<boolean> {
        await user.updateOne({$inc: {trek_coin_balance: trekCoins}})
        await this.transactionService.create({
            amount: trekCoins,
            user_id: user.id,
            description: `Trek Coins Credit`,
            type: TRANSACTION_TYPE.CREDIT,
            entity: TRANSACTION_ENTITY.TREK_COINS,
            reference: usePaystackService.getReference(),
            wallet_balance_before_transaction:user.wallet.balance,
            trek_coin_balance_before_transaction:user.trek_coin_balance
        })
        this.notificationService.create({
            title: SUCCESS_MESSAGES.TREK_COINS_CREDIT_TITLE.toString(),
            description: `Your Trek coins account has been credited with the sum of ${trekCoins}`,
            user_id: user.id,
            priority: true
        })
        return true
    }

    async debitUserTrekCoins(user: UserDocument, trekCoins: number): Promise<boolean> {
        await user.updateOne({$inc: {trek_coin_balance: -trekCoins}})
        await this.transactionService.create({
            amount: trekCoins,
            user_id: user.id,
            description: `Trek Coins Debit`,
            type: TRANSACTION_TYPE.DEBIT,
            entity: TRANSACTION_ENTITY.TREK_COINS,
            reference: usePaystackService.getReference(),
            wallet_balance_before_transaction:user.wallet.balance,
            trek_coin_balance_before_transaction:user.trek_coin_balance
        })
        this.notificationService.create({
            title: 'Trek Coins Account Debit',
            description: `Your Trek coins account has been debited with the sum of ${trekCoins}`,
            user_id: user.id,
            priority: true
        })
        return true
    }

    async creditUserWallet(user: UserDocument, amount: number): Promise<boolean> {
        await user.updateOne({$inc: {"wallet.balance": amount}})
        await this.transactionService.create({
            amount,
            user_id: user.id,
            description: `Wallet Credit`,
            type: TRANSACTION_TYPE.CREDIT,
            entity: TRANSACTION_ENTITY.WALLET,
            reference: usePaystackService.getReference(),
            wallet_balance_before_transaction:user.wallet.balance,
            trek_coin_balance_before_transaction:user.trek_coin_balance
        })
        this.notificationService.create({
            title: 'Wallet Credited Successfully',
            description: `Your Trades Trek wallet account has been credited with the sum of ${amount}`,
            user_id: user.id,
            priority: true
        })
        return true
    }

    async debitUserWallet(user: UserDocument, amount: number, createTransaction: boolean = true): Promise<boolean> {
        await user.updateOne({$inc: {"wallet.balance": -amount}})
        if (createTransaction) {
            await this.transactionService.create({
                amount,
                user_id: user.id,
                description: `Wallet Debit`,
                type: TRANSACTION_TYPE.DEBIT,
                entity: TRANSACTION_ENTITY.WALLET,
                reference: usePaystackService.getReference(),
                wallet_balance_before_transaction:user.wallet.balance,
                trek_coin_balance_before_transaction:user.trek_coin_balance
            })
            this.notificationService.create({
                title: 'Wallet Debited Successfully',
                description: `Your Trades Trek wallet account has been debited with the sum of ${amount}`,
                user_id: user.id,
            })
        }
        return true
    }

    convertToTrekCoins(amount: number, currency = DEFAULT_CURRENCY.code): number {
        console.log(amount)
        return amount / parseInt(this.configService.get('TREK_COINS_CONVERSION_RATE_IN_NAIRA'))
    }

    convertTrekCoinsToCash(trekCoins: number, currency = DEFAULT_CURRENCY.code): number {
        return trekCoins * parseInt(this.configService.get('TREK_COINS_CONVERSION_RATE_IN_NAIRA'))
    }


}
