import { ApiProperty } from '@nestjs/swagger';

import { ExpertiseScopeDto } from './expertiseScope.dto';

export class IterationDto {
    @ApiProperty()
    iteration?: string;

    @ApiProperty()
    expertiseScopes?: ExpertiseScopeDto[];
}
