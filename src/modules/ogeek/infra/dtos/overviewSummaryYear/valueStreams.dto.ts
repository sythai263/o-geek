import { ApiProperty } from '@nestjs/swagger';

import { ExpertiseScopeDto } from './expertiseScope.dto';

export class ValueStreamsDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Delivery' })
    name: string;

    @ApiProperty({ type: ExpertiseScopeDto, isArray: true })
    expertiseScopes: ExpertiseScopeDto[];

    constructor(
        id?: number,
        name?: string,
        expertiseScopes?: ExpertiseScopeDto[],
    ) {
        this.id = id;
        this.name = name;
        this.expertiseScopes = expertiseScopes;
    }
}
