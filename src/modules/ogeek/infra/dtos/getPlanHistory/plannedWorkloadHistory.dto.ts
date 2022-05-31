import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ValueStreamShortDto } from './valueStreamShort.dto';

export class PlannedWorkloadHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ type: ValueStreamShortDto, isArray: true })
    valueStreams: ValueStreamShortDto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: ['Early bird', 'Early bird', 'Early bird'] })
    notes: string[];

    constructor(notes: string[], valueStreams: ValueStreamShortDto[]) {
        this.notes = notes;
        this.valueStreams = [...valueStreams];
    }
}
