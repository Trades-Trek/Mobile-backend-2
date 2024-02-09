import {Injectable} from '@nestjs/common';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {UsersService} from "../users/users.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {OtpService} from "../otp/otp.service";
import {User} from "../users/schemas/user.schema";
import {JwtService} from "@nestjs/jwt";

const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private otpService: OtpService, private jwtService: JwtService) {
    }

    async signup(createAuthDto: SignupDto) {
        const {email, fullName, password, referralCode} = createAuthDto;
        const user = await this.userService.findOne(email, ['email', 'verified', '_id']) ?? await this.userService.create({
            fullName,
            email,
            password: await bcrypt.hash(password, 10),
            referralCode
        })
        if (user.verified) returnErrorResponse('Already a user')

        await this.otpService.sendOtpViaEmail(user.email)
        return successResponse({message:'A one time passcode has been sent to your email', user})
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.userService.findOne(email)
        if (!user) returnErrorResponse('User does not exist')
        if (!await this.comparePassword(password, user.password)) returnErrorResponse('Invalid credentials')
        const access_token = user.verified ? await this.generateAccessToken(user._id, user.username) : null;
        return successResponse({is_verified: user.verified, access_token})

    }

    async generateAccessToken(user_id: any, username: string) {
        const payload = {sub: user_id, username};
        return await this.jwtService.signAsync(payload);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }


}
