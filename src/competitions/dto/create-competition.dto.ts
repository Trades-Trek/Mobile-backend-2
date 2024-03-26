import {IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {COMPETITION_TYPE} from "../../enums/competition.enum";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCompetitionDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty({
        enum: COMPETITION_TYPE
    })
    @IsNotEmpty()
    @IsEnum(COMPETITION_TYPE)
    type: COMPETITION_TYPE

    @IsNotEmpty()
    @Max(0)
    @Min(1)
    allow_late_entry: number

    @IsNotEmpty()
    @IsNumber()
    @Max(0)
    @Min(1)
    allow_portfolio_viewing: number

    @IsNotEmpty()
    @IsNumber()
    @Max(0)
    @Min(1)
    allow_portfolio_resetting: number

    @IsNotEmpty()
    start_date: string

    end_date?: string

    @IsNotEmpty()
    market_delay: number

    @IsNotEmpty()
    minimum_price: number

    @IsNotEmpty()
    quick_sell: number

    @IsNotEmpty()
    commission: number

    @IsNotEmpty()
    start_cash: number

    participant?: string

}
