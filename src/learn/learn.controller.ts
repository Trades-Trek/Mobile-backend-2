import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { LearnService } from './services/learn.service';
import { CreateLearnDto } from './dto/create-learn.dto';
import { UpdateLearnDto } from './dto/update-learn.dto';
import {CategoryService} from "./services/category.service";
import {Types} from "mongoose";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";
import {CreateCategoryDto, UpdateCategoryDto} from "./dto/create-category.dto";

@Controller('learn')
export class LearnController {
  constructor(private readonly learnService: LearnService, private categoryService:CategoryService) {}

  @Post('/categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('categories')
  findAllCategories(@GetPagination() pagination:Pagination) {
    return this.categoryService.findAll(pagination);
  }

  @Patch('categories/:category_id')
  updateCategory(@Param('category_id') categoryId: Types.ObjectId, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }

  @Delete('categories/:category_id')
  removeCategory(@Param('category_id') categoryId: Types.ObjectId) {
    return this.categoryService.remove(categoryId);
  }

  @Post('/resources')
  create(@Body() createLearnDto: CreateLearnDto) {
    return this.learnService.create(createLearnDto);
  }

  @Get('resources')
  findAll(@Query('category_id') categoryId: Types.ObjectId, @GetPagination() pagination:Pagination) {
    return this.learnService.findAll(categoryId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearnDto: UpdateLearnDto) {
    return this.learnService.update(+id, updateLearnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learnService.remove(+id);
  }
}
