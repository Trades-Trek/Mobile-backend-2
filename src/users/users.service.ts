import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./schemas/user.schema";
import {Model, Types} from "mongoose";
import {UserQueryDto} from "./dto/query.dto";
import {ResetPasswordDto} from "../auth/dto/reset-password.dto";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ResetPasswordToken} from "./schemas/token.schema";
const bcrypt = require("bcrypt");
const crypto = require("crypto")

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(ResetPasswordToken.name) private resetPasswordTokenModel: Model<ResetPasswordToken>) {
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


    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const {newPassword, resetPasswordToken, confirmPassword} = resetPasswordDto;
        let passwordResetToken = await this.resetPasswordTokenModel.findOne({resetPasswordToken});
        if (!passwordResetToken) returnErrorResponse("Invalid or expired password reset token");

        const isValid = await bcrypt.compare(resetPasswordToken, passwordResetToken.token);
        if (!isValid) {
            returnErrorResponse("Invalid or expired password reset token");
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await this.userModel.updateOne(
            {_id: passwordResetToken.userId},
            {$set: {password: hash}},
        );
        return successResponse('Your password has been reset successfully')
    }


    async requestPasswordReset(userId: Types.ObjectId): Promise<number> {
        let token = await this.resetPasswordTokenModel.findOne({userId: userId});
        if (token) await token.deleteOne();
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(10));
        await this.resetPasswordTokenModel.create({
            userId: userId,
            token: hash,
        })
        return resetToken;
    }


    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
