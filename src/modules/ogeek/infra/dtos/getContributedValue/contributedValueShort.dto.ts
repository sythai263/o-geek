import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { ExpertiseScopeShortDto } from './expertiseScopeShort.dto';
import { ValueStreamShortInsertDto } from './valueStreamShort.dto';
export class ContributedValueShortDto {
    @IsNumber()
    @ApiProperty({ example: 3 })
    id: number;

    @ApiProperty({ type: ValueStreamShortInsertDto })
    valueStream: ValueStreamShortInsertDto;

    @ApiProperty({ type: ExpertiseScopeShortDto })
    expertiseScope: ExpertiseScopeShortDto;

    constructor(
        id?: number,
        valueStream?: ValueStreamShortInsertDto,
        expertiseScope?: ExpertiseScopeShortDto,
    ) {
        this.id = id;
        this.valueStream = valueStream;
        this.expertiseScope = expertiseScope;
    }
}
