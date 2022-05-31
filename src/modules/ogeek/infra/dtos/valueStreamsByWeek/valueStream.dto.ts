import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
import { ExpertiseScopeWithinValueStreamDto } from './expertiseScopeWithinValueStream.dto';

export class ValueStreamByWeekDto {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    @ApiProperty({ type: UniqueEntityID, example: 1 })
    id: UniqueEntityID | number;

    @ApiProperty({ example: 'Delivery' })
    @IsString()
    name: string;

    @ApiProperty({
        example: [
            {
                expertiseScope: 'Product Backend',
                expertiseScopeId: 1,
                committedWorkload: 20,
                plannedWorkload: 12,
                actualPlannedWorkload: 12,
                worklog: 10,
            },
        ],
    })
    @IsArray()
    expertiseScopes: ExpertiseScopeWithinValueStreamDto[];
}
