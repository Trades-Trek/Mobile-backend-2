import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus} from '@nestjs/common';
import {WalletService} from './wallet.service';
import { FundTrekCoinsDto} from './dto/wallet.dto';
import {successResponse} from "../utils/response";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {BankTransferDto} from "./dto/bank-transfer.dto";
import {SubscribedGuard} from "../guards/subscribed.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {
    }

    @Get('trek-coins/convert')
    convertToTrekCoins(@Query('amount') amount: number) {
        return successResponse({trek_coins: this.walletService.convertToTrekCoins(amount)})
    }

    @Get('trek-coins/convert/cash')
    convertTrekCoinsToCash(@Query('trek_coins') trekCoins: number) {
        return successResponse({cash: this.walletService.convertTrekCoinsToCash(trekCoins)})
    }

    @ApiOperation({summary: "Convert cash to trek coins"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('trek-coins/convert')
    fundTrekCoinsViaWallet(@AuthUser() user:UserDocument, @Body() fundTrekCoinsDto:FundTrekCoinsDto){
        return this.walletService.fundTrekCoinsViaWallet(user,fundTrekCoinsDto)
    }

    @ApiOperation({summary: "Convert trek coins to cash"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @UseGuards(SubscribedGuard)
    @Post('trek-coins/convert/cash')
    withdrawTrekCoins(@AuthUser() user:UserDocument, @Body() fundTrekCoinsViaWalletDto:FundTrekCoinsDto){
        return this.walletService.withdrawTrekCoins(user,fundTrekCoinsViaWalletDto)
    }

    @ApiOperation({summary: "Transfer cash from wallet to bank account"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/bank/transfer')
    bankTransfer(@AuthUser() user:UserDocument, @Body() bankTransferDto:BankTransferDto){
        return this.walletService.transferToBankAccount(user,bankTransferDto)
    }
}
