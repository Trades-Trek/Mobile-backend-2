import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {AuthUser} from "../decorators/user.decorator";
import {User, UserDocument} from "./schemas/user.schema";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }


    @Get()
    findAll() {
        return this.usersService.findAll();
    }


    @Patch('profile')
    update(@Body() updateUserDto: UpdateUserDto, @AuthUser() user: UserDocument) {
        return this.usersService.update(user, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
