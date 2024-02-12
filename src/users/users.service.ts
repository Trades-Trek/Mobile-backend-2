import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./schemas/user.schema";
import {Model} from "mongoose";
import {UserQueryDto} from "./dto/query.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    async create(createUserDto: CreateUserDto) {
        const formatted_data = {
            firstName: createUserDto.fullName.split(' ').slice(0, -1).join(' '),
            lastName: createUserDto.fullName.split(' ').slice(-1).join(' '),
            username: createUserDto.fullName,
            password: createUserDto.password,
            fullName: createUserDto.fullName,
            email: createUserDto.email,
            yourReferrer: createUserDto.referralCode
        }
        return await this.userModel.create(formatted_data)
    }

    findAll() {
        return `This action returns all users`;
    }

    async findOne(query: UserQueryDto) {
        const queryObj = {};
        queryObj[query.field] = query.data;
        console.log(queryObj)
        return this.userModel.findOne(queryObj).select(query.fields_to_load);
    }


    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
