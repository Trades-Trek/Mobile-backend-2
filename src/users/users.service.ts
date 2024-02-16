import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model, ObjectId, Types} from "mongoose";
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
        createUserDto['your_referrer'] = createUserDto.referral_code;
        createUserDto['full_name'] = createUserDto.first_name + ' ' + createUserDto.last_name;
        createUserDto['username'] = createUserDto.first_name + '@0' + this.userModel.countDocuments();
        return await this.userModel.create(createUserDto)
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
        const {new_password, reset_password_token, confirm_password, user_id} = resetPasswordDto;
        let passwordResetToken = await this.resetPasswordTokenModel.findOne({user_id});
        if (!passwordResetToken) returnErrorResponse("Invalid or expired password reset token");
        const isValid = await bcrypt.compare(reset_password_token, passwordResetToken.token);
        if (!isValid) {
            returnErrorResponse("Invalid or expired password reset token");
        }
        const hash = await bcrypt.hash(new_password, 10);
        await this.userModel.updateOne(
            {_id: passwordResetToken.user_id},
            {$set: {password: hash}},
        );
        await passwordResetToken.deleteOne()
        return successResponse('Your password has been reset successfully')
    }


    async requestPasswordReset(user_id: Types.ObjectId): Promise<number> {
        let token = await this.resetPasswordTokenModel.findOne({user_id});
        if (token) await token.deleteOne();
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(10));
        await this.resetPasswordTokenModel.create({
            user_id,
            token: hash,
        })
        return resetToken;
    }


    async update(user:UserDocument, updateUserDto: UpdateUserDto) {
        updateUserDto['full_name'] = updateUserDto.first_name + ' ' + updateUserDto.last_name;
        await user.updateOne({id: user.id}, {$set:updateUserDto})
        return successResponse({message: 'profile updated successfully'})
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
