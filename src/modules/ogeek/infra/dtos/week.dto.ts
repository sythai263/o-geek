import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class WeekDto {
    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({ example: 12 })
    week: number;

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({ example: 2022 })
    year: number;

    constructor(week: number, year: number) {
        this.week = week;
        this.year = year;
    }
}
