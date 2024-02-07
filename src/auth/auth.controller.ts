import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/signup')
  // signUp(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  @ApiOperation({summary: "Login", description: "Login with email or google "})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "returns the user data with an access token"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid request or validation errors"
  })
  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

}
