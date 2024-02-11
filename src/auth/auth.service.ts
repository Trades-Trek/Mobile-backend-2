import {Injectable} from '@nestjs/common';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {UsersService} from "../users/users.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {OtpService} from "../otp/otp.service";
import {User} from "../users/schemas/user.schema";
import {JwtService} from "@nestjs/jwt";
import {VerifyUserDto} from "./dto/verify-user.dto";

const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private otpService: OtpService, private jwtService: JwtService) {
    }
    async signup(createAuthDto: SignupDto) {
        const {email, fullName, password, referralCode} = createAuthDto;
        if(referralCode){
            if(!await this.userService.findOne(referralCode)) returnErrorResponse('Invalid referral code')
        }
        const user = await this.userService.findOne(email, ['email', 'verified', '_id']) ?? await this.userService.create({
            fullName,
            email,
            password: await bcrypt.hash(password, 10),
            referralCode
        })
        if (user.verified) returnErrorResponse('Already a user')

        await this.otpService.sendOtpViaEmail(user.email)
        return successResponse({isVerified: false, message: 'A one time passcode has been sent to your email'})
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.userService.findOne(email)
        if (!user) returnErrorResponse('User does not exist')

        if (!await this.comparePassword(password, user.password)) returnErrorResponse('Invalid credentials')

        const accessToken = user.verified ? await this.generateAccessToken(user._id, user.username) : await this.otpService.sendOtpViaEmail(user.email);

        return successResponse({isVerified: user.verified, accessToken, user: user.verified ? user : null})

    }

    async verifyUser(verifyUserDto: VerifyUserDto) {
        const {email, otp} = verifyUserDto;
        if (!await this.otpService.verifyOtpViaMail(email, otp)) returnErrorResponse('Invalid Otp')
        const user = await this.userService.findOne(email)
        if (user.verified) returnErrorResponse('Your user account has already been verified')
        user.verified = true;
        await user.save();

        if(user.yourReferrer){
            // referral integration
        }
        // generate access token
        const accessToken = await this.generateAccessToken(user._id, user.username);
        return successResponse({isVerified: user.verified, accessToken, user})

    }

    async generateAccessToken(user_id: any, username: string) {
        const payload = {sub: user_id, username};
        return await this.jwtService.signAsync(payload);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }


}
