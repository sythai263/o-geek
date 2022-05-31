import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetPotentialIssuesInputDto {
    userId?: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 3 })
    @Type(() => Number)
    startWeek: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 2022 })
    @Type(() => Number)
    startYear: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 3 })
    @Type(() => Number)
    endWeek: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 2023 })
    @Type(() => Number)
    endYear: number;

    constructor(
        startWeek: number,
        startYear: number,
        endWeek: number,
        endYear: number,
    ) {
        this.startWeek = startWeek;
        this.startYear = startYear;
        this.endWeek = endWeek;
        this.endYear = endYear;
    }
}
