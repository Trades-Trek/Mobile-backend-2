import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {AdminService} from '../services/admin.service';
import {UpdateAdminDto} from '../dto/update-admin.dto';
import {LoginDto} from "../../auth/dto/login.dto";
import {Public} from "../../decorators/public-endpoint.decorator";
import {AuthUser} from "../../decorators/user.decorator";
import {User} from "../../users/schemas/user.schema";
import {AuthService} from "../../auth/auth.service";
import {AuthId} from "../../decorators/user_id.decorator";
import {Types} from "mongoose";
import {ApiTags} from "@nestjs/swagger";
import {PaginationDto} from "../../enums/pagination.enum";
import {GetPagination} from "../../decorators/pagination.decorator";
import {TransactionsService} from "../../transactions/transactions.service";
import {TransactionQueryDto} from "../../transactions/dto/create-transaction.dto";
import {ReferralsService} from "../../referrals/referrals.service";
import {ReferralQueryDto} from "../../referrals/dto/referral.dto";

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService, private authService: AuthService, private transactionService: TransactionsService, private referralService: ReferralsService) {
    }

    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.adminService.login(loginDto);
    }


    @Get('auth')
    auth(@AuthId() userId: Types.ObjectId) {
        return this.authService.authUser(userId);
    }

    @Get('transactions')
    transactions(@Query() query: TransactionQueryDto, @GetPagination() pagination) {
        return this.transactionService.getAllTransactions(query, pagination)
    }

    @Get('referrals')
    referrals(@Query() query: ReferralQueryDto, @GetPagination() pagination) {
        return this.referralService.getAllReferrals(query, pagination)
    }
}
