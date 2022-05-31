import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ExpertiseScopeDto } from './expertiseScope.dto';
import { ValueStreamDto } from './valueStream.dto';
export class ContributedValueDto {
    @ApiProperty({
        type: () => UniqueEntityID,
        example: new UniqueEntityID(21),
    })
    id: UniqueEntityID;

    @ApiProperty({ type: () => ValueStreamDto })
    valueStream: ValueStreamDto;

    @ApiProperty({ type: () => ExpertiseScopeDto })
    expertiseScope: ExpertiseScopeDto;
}
