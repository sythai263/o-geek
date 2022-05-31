import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { HistoryWorkloadDto } from './historyWorkload.dto';

export class HistoryWorkloadDataDto {
    @ApiProperty()
    @IsNumber()
    itemCount: number;

    @ApiProperty()
    @IsArray()
    data: HistoryWorkloadDto[];
}
