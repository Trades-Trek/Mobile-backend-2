import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {GoogleOauthGuard} from "./guards/google-oauth.guard";
import {VerifyUserDto} from "./dto/verify-user.dto";
import {CreateOtpDto} from "../otp/dto/create-otp.dto";
import {VerifyOtpDto} from "../otp/dto/verify-otp.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: "Signup", description: "Signup"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "creates a user account"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/signup')
    signup(@Body() createAuthDto: SignupDto) {
        return this.authService.signup(createAuthDto);
    }


    @ApiOperation({summary: "Login", description: "Login with email and password"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the user data with an access token"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    @ApiOperation({summary: "Verify user", description: "Used for verifying a newly registered user"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the user data with an access token"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/verify-user')
    verifyUser(@Body() verifyUserDto: VerifyUserDto) {
        return this.authService.verifyUser(verifyUserDto);
    }

    @ApiOperation({summary: "Send Otp", description: "Send otp to email"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Poor network or validation errors"
    })
    @Post('/send-otp')
    sendOtp(@Body() sendOtpDto: CreateOtpDto) {
        return this.authService.sendOtp(sendOtpDto);
    }

    @ApiOperation({summary: "Re-send Otp", description: "Re-send otp to email"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Poor network or validation errors"
    })
    @Post('/re-send-otp')
    resendOtp(@Body() sendOtpDto: CreateOtpDto) {
        return this.authService.sendOtp(sendOtpDto);
    }

    @ApiOperation({summary: "Verify Otp", description: "Used for verifying otp"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Poor network or validation errors"
    })
    @Post('/verify-otp')
    verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @ApiOperation({summary: "Reset Password", description: "Used for resetting password"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @ApiOperation({summary: "Google login", description: "Login with google"})
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    google() {
    }

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req, @Res() res) {
        console.log(req.user)
        // const token = await this.authService.signIn(req.user);
        return res.sendStatus(200)
    }

}
