import {UserDocument} from "../../users/schemas/user.schema";

export class CreateActivityDto {
    activity: string;

    by:UserDocument
}
