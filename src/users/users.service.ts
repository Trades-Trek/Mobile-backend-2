import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model, Types} from "mongoose";
import {UserQueryDto} from "./dto/query.dto";
import {ResetPasswordDto} from "../auth/dto/reset-password.dto";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ResetPasswordToken} from "./schemas/token.schema";
import {UpdateSettingsDto} from "./dto/settings.dto";
import {isEmpty} from "class-validator";
import {CreatePinDto, UpdatePinDto} from "./dto/pin.dto";
import {USER} from "./enums/user.enum";
import {TransactionsService} from "../transactions/transactions.service";
import {TRANSACTION_ENTITY, TRANSACTION_TYPE} from "../enums/transaction_type";
import {NotificationsService} from "../notifications/notifications.service";

const bcrypt = require("bcrypt");
const crypto = require("crypto")

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(ResetPasswordToken.name) private resetPasswordTokenModel: Model<ResetPasswordToken>, private transactionService: TransactionsService, private notificationService: NotificationsService) {
    }

    async create(createUserDto: CreateUserDto) {
        createUserDto['referrer_code'] = createUserDto.referral_code;
        createUserDto['full_name'] = createUserDto.first_name + ' ' + createUserDto.last_name;
        createUserDto['username'] = createUserDto.first_name + '@0' + await this.userModel.countDocuments({}) + 1;
        return await this.userModel.create(createUserDto)
    }

    async updateUserSettings(user: UserDocument, updateSettingsDto: UpdateSettingsDto) {
        const updatedFields = {
            settings: {}
        };
        Object.keys(updateSettingsDto).forEach(key => {
            if (!isEmpty(updateSettingsDto[key])) {
                updatedFields.settings[key] = updateSettingsDto[key];
            }
        });
        await user.updateOne(updatedFields)
        return successResponse('settings updated successfully')
    }

    async createUserPin(user: UserDocument, createPinDto: CreatePinDto) {
        if (user.pin) returnErrorResponse('cannot create more than one pin')
        await user.updateOne({pin: createPinDto.pin, has_pin: true})
        return successResponse('Your pin has been created successfully')
    }

    async updateUserPin(user: UserDocument, updatePinDto: UpdatePinDto) {
        if (user.pin !== updatePinDto.current_pin) returnErrorResponse('Incorrect pin')
        await user.updateOne({pin: updatePinDto.current_pin})
        return successResponse('Your pin has been updated successfully')
    }

    async findOne(query: UserQueryDto) {
        const queryObj = {};
        queryObj[query.field] = query.data;
        query.fields_to_load = !query.fields_to_load ? !query.is_server_request ? USER.DEFAULT_FIELDS : USER.DEFAULT_SERVER_FIELDS : query.fields_to_load;
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


    async update(user: UserDocument, updateUserDto: UpdateUserDto) {
        const updatedFields = {};
        Object.keys(updateUserDto).forEach(key => {
            if (!isEmpty(updateUserDto[key])) {
                updatedFields[key] = updateUserDto[key];
            }
        });
        updatedFields['full_name'] = updateUserDto.first_name + ' ' + updateUserDto.last_name;
        await user.updateOne(updatedFields)
        return successResponse({message: 'profile updated successfully'})
    }


    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
