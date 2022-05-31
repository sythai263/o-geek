import { ApiProperty } from '@nestjs/swagger';

import { UniqueEntityID } from '../../../../../core/domain/UniqueEntityID';
export class AverageActualWorkloadDto {
    @ApiProperty()
    id: UniqueEntityID | number;

    @ApiProperty()
    expertiseScope: string;

    @ApiProperty({ example: 40 })
    avgActualWorkload: number;
}
