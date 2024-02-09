import {IsEmpty, IsNotEmpty} from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    fullName:string

    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    password:string

    referralCode?:string

}
