import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {RatingsService} from './ratings.service';
import {CreateRatingDto} from './dto/create-rating.dto';
import {UpdateRatingDto} from './dto/update-rating.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {PaginationDto} from "../decorators/pagination.decorator";
import {PaginationParams} from "../decorators/pagination.decorator";

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {
    }

    @Post()
    create(@AuthUser() user: UserDocument, @Body() createRatingDto: CreateRatingDto) {
        return this.ratingsService.create(user, createRatingDto);
    }

    @Get()
    findAll(@AuthUser() user: UserDocument, @PaginationParams() paginationParameters: PaginationDto) {
        return this.ratingsService.findAll(user, paginationParameters);
    }


}
