import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class ActualWorkloadByWeekDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    week: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    actualWorklog: number;
}
