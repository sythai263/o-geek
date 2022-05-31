import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { ExpertiseScopeShortDto } from './expertiseScopeShort.dto';

export class ValueStreamShortInsertDto {
    @IsNumber()
    @ApiProperty({ example: 1 })
    id: number;

    @IsString()
    @ApiProperty({ example: 'Delivery' })
    name?: string;

    @IsArray()
    @ApiProperty({ type: ExpertiseScopeShortDto, isArray: true })
    expertiseScopes?: ExpertiseScopeShortDto[];

    constructor(
        id?: number,
        name?: string,
        expertiseScopes?: ExpertiseScopeShortDto[],
    ) {
        this.id = id;
        this.name = name;
        this.expertiseScopes = expertiseScopes;
    }
}
