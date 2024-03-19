import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {PlansService} from './plans.service';
import {CreatePlanDto} from './dto/create-plan.dto';
import {UpdatePlanDto} from './dto/update-plan.dto';
import {Types} from "mongoose";
import {successResponse} from "../utils/response";
import {CreateListingDto} from "./dto/create-listing.dto";


@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) {
    }

    @Post()
    async create(@Body() createPlanDto: CreatePlanDto) {
        await this.plansService.createOrUpdatePlan(createPlanDto);
        return successResponse('plan created successfully')
    }

    @Post('listing')
    async createListing(@Body() createListingDto: CreateListingDto) {
        await this.plansService.createListing(createListingDto);
        return successResponse('listing created successfully')
    }

    @Get()
    findAll() {
        return this.plansService.findAll();
    }

    @Patch(':id')
    async update(@Param('id') planId: Types.ObjectId, @Body() updatePlanDto: CreatePlanDto) {
        const updatedPlan = await this.plansService.createOrUpdatePlan(updatePlanDto, planId);
        return successResponse({message:'plan updated successfully', plan:updatedPlan})
    }

}
