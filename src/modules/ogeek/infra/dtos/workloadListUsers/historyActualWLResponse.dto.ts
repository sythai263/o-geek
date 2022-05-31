import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { HistoryActualWorkloadDto } from './historyActualWorkload.dto';

export class HistoryActualWLResponse {
    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsArray()
    actualWorkloads: HistoryActualWorkloadDto[];
}
