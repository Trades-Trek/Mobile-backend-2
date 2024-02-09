import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {GoogleOauthGuard} from "./guards/google-oauth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: "Signup", description: "Signup"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the user data with an access token"
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

    @ApiOperation({summary: "Google login", description: "Login with google"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the user data with an access token"
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
