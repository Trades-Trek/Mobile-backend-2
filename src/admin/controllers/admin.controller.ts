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

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private authService:AuthService) {}

  @Post('create')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }


  @Get('auth')
  auth(@AuthId() userId:Types.ObjectId) {
    return this.authService.authUser(userId);
  }


  // @Get()
  // findAll() {
  //   return this.adminService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
