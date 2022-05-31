import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class HistoryActualWorkloadDto {
    @ApiProperty()
    @IsNumber()
    actualWorkload: number;
}
