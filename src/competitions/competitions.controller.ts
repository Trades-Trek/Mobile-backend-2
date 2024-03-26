import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";
import {Types} from "mongoose";
import {ApiTags} from "@nestjs/swagger";
@ApiTags('Competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  create(@Body() createCompetitionDto: CreateCompetitionDto, @AuthUser() user:UserDocument) {
    return this.competitionsService.create(user,createCompetitionDto);
  }

  @Get()
  findAll(@AuthUser() user:UserDocument, @GetPagination() pagination:Pagination) {
    return this.competitionsService.findAll(user, pagination);
  }

  @Get(':competition_id')
  findOne(@Param('competition_id') competitionId: Types.ObjectId) {
    return this.competitionsService.findOne(competitionId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionDto: UpdateCompetitionDto) {
    return this.competitionsService.update(+id, updateCompetitionDto);
  }

  @Delete(':competition_id')
  remove(@Param('competition_id') competitionId: Types.ObjectId, @AuthUser() user:UserDocument) {
    return this.competitionsService.remove(competitionId, user);
  }
}
