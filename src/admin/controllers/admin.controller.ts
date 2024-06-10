import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import {LoginDto} from "../../auth/dto/login.dto";
import {Public} from "../../decorators/public-endpoint.decorator";
import {AuthUser} from "../../decorators/user.decorator";
import {User} from "../../users/schemas/user.schema";
import {AuthService} from "../../auth/auth.service";
import {AuthId} from "../../decorators/user_id.decorator";
import {Types} from "mongoose";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private authService:AuthService) {}


  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }


  @Get('auth')
  auth(@AuthId() userId:Types.ObjectId) {
    return this.authService.authUser(userId);
  }


}
