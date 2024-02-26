import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {BanksService} from './banks.service';
import {CreateBankDto} from './dto/create-bank.dto';
import {UpdateBankDto} from './dto/update-bank.dto';
import {WithdrawDto} from "./dto/withdraw.dto";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";

@Controller('banks')
export class BanksController {
    constructor(private readonly banksService: BanksService) {
    }

    @Post('withdraw')
    create(@Body() withdrawDto: WithdrawDto, @AuthUser() user: UserDocument) {
        return this.banksService.withdraw(user, withdrawDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.banksService.findOne(+id);
    }

}
