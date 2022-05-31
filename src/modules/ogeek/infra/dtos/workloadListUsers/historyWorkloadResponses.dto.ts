import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { PaginationResponseDto } from '../pagination.dto';
import { HistoryWorkloadDto } from './historyWorkload.dto';

export class HistoryWorkloadResponseDto {
    @ApiProperty({ type: PaginationResponseDto })
    meta: PaginationResponseDto;

    @ApiProperty({ type: HistoryWorkloadDto })
    @IsArray()
    data: HistoryWorkloadDto[];
}
