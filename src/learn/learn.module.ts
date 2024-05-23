import {Module} from '@nestjs/common';
import {LearnService} from './services/learn.service';
import {LearnController} from './learn.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Category, CategorySchema} from "./schemas/category.schema";
import {LearnResources, LearnResourcesSchema} from "./schemas/learn_resources.schema";
import {Quiz, QuizSchema} from "./schemas/quiz.schema";
import {CategoryService} from "./services/category.service";

@Module({
    imports: [MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}, {
        name: Category.name,
        schema: CategorySchema
    }, {name: LearnResources.name, schema: LearnResourcesSchema}, {
        name: Quiz.name,
        schema: QuizSchema
    }])],
    controllers: [LearnController],
    providers: [LearnService, CategoryService],
})
export class LearnModule {
}
