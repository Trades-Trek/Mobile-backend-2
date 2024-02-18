import {IsNotEmpty, IsNumber, Max, Min} from "class-validator";

export class CreatePinDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(4)
    @Max(4)
    pin:number;
}

export class UpdatePinDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(4)
    @Max(4)
    current_pin:number;

    @IsNotEmpty()
    @IsNumber()
    @Min(4)
    @Max(4)
    new_pin:number;
}