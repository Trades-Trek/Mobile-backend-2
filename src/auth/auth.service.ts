import {Injectable} from '@nestjs/common';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {UsersService} from "../users/users.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {OtpService} from "../otp/otp.service";
import {User} from "../users/schemas/user.schema";
import {JwtService} from "@nestjs/jwt";
import {VerifyUserDto} from "./dto/verify-user.dto";
import {USER} from "../users/enums/user.enum";
import {CreateOtpDto} from "../otp/dto/create-otp.dto";
import {VerifyOtpDto} from "../otp/dto/verify-otp.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {ResetPasswordToken} from "../users/schemas/token.schema";

const bcrypt = require("bcrypt");
const crypto = require("crypto")

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private otpService: OtpService, private jwtService: JwtService) {
    }

    async signup(createAuthDto: SignupDto) {
        const {email, first_name, last_name, password, referral_code} = createAuthDto;
        if (referral_code) {
            if (!await this.userService.findOne({
                field: USER.REFERRAL_CODE,
                data: referral_code,
                fields_to_load: USER.REFERRAL_CODE
            })) returnErrorResponse('Invalid referral code')
        }
        const user = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
            fields_to_load: 'email verified _id'
        }) ?? await this.userService.create({
            first_name,
            last_name,
            email,
            password: await bcrypt.hash(password, 10),
            referral_code
        })
        if (user.verified) returnErrorResponse('Already a user')

        await this.otpService.sendOtpViaEmail(user.email)
        return successResponse({isVerified: false, message: 'A one time passcode has been sent to your email'})
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.userService.findOne({field: USER.EMAIL, data: email})
        if (!user) returnErrorResponse('User does not exist')

        if (!await this.comparePassword(password, user.password)) returnErrorResponse('Invalid credentials')

        const accessToken = user.verified ? await this.generateAccessToken(user._id, user.username) : await this.otpService.sendOtpViaEmail(user.email, true, user.full_name);

        return successResponse({is_verified: user.verified, access_token:accessToken, user: user.verified ? user : null})

    }

    async verifyUser(verifyUserDto: VerifyUserDto) {
        const {email, otp} = verifyUserDto;
        if (!await this.otpService.verifyOtpViaMail(email, otp)) returnErrorResponse('Invalid Otp')
        const user = await this.userService.findOne({field: USER.EMAIL, data: email})
        if (user.verified) returnErrorResponse('Your user account has already been verified')
        user.verified = true;
        await user.save();

        if (user.your_referrer) {
            // referral integration
        }
        // generate access token
        const accessToken = await this.generateAccessToken(user._id, user.username);
        return successResponse({is_verified: user.verified, access_token:accessToken, user})

    }

    async sendOtp(sendOtpDto: CreateOtpDto) {
        const {email} = sendOtpDto;
        await this.otpService.sendOtpViaEmail(email)
        return successResponse('Otp sent to your mail')
    }

    async verifyOtp(sendOtpDto: VerifyOtpDto) {
        const {email, otp, request_password_reset} = sendOtpDto;
        const user = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
            fields_to_load: 'email'
        });
        if (!user) returnErrorResponse('User does not exist');

        if (!await this.otpService.verifyOtpViaMail(email, otp)) returnErrorResponse('Could not Verify OTP')
        const passwordResetToken = request_password_reset ? await this.userService.requestPasswordReset(user._id) : null;
        const returnData = request_password_reset ? {
            message: 'Otp verified successfully',
            password_reset_token:passwordResetToken,
            user_id: user._id
        } : {message: 'Otp verified successfully'};
        return successResponse(returnData)
    }


    async generateAccessToken(user_id: any, username: string) {
        const payload = {sub: user_id, username};
        return await this.jwtService.signAsync(payload);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }


}
