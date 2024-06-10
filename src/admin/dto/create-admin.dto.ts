import {IsEnum, IsNotEmpty} from "class-validator";
import {Role} from "../../enums/role.enum";
import {ApiProperty} from "@nestjs/swagger";

export class CreateAdminDto {
    @IsNotEmpty()
    first_name:string

    @IsNotEmpty()
    last_name:string

    @IsNotEmpty()
    email:string

    phone_number:string

    @ApiProperty({enum:Role})
    @IsNotEmpty()
    @IsEnum(Role)
    role:Role

    @IsNotEmpty()
    password:string
}
