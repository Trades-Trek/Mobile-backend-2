export class UserQueryDto {
    field: string;
    data: string;
    fields_to_load?: string = 'email password verified firstName lastName username fullName referralCode';
}
