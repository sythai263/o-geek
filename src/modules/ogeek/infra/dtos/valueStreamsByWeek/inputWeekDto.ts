import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class InputWeekDto {
    @Type(() => Number)
    @ApiProperty()
    @IsInt()
    @Min(1, { message: 'week must bigger than 1' })
    @Max(52, { message: 'Week must less than 52' })
    @IsNotEmpty({ message: 'You need to attach week to request' })
    week: number;
}
