import {IsNotEmpty} from "class-validator";
import {Types} from "mongoose";
import {UserDocument} from "../../users/schemas/user.schema";

export class CreateSocialDto {
    @IsNotEmpty()
    following_id: Types.ObjectId;

    @IsNotEmpty()
    follower: UserDocument;
}
