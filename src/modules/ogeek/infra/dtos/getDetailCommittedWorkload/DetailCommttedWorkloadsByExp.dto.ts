import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

import { ExpertiseScopeDto } from '../expertiseScope.dto';
import { ActualWorklogsByProjectDto } from './ActualWorkloadsByProject.dto';

export class DetailCommittedWorkloadsByExpDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    committedWorkloadId: number;

    @ApiProperty({ example: 20 })
    @IsInt()
    committedWorkload: number;

    @ApiProperty({ type: ExpertiseScopeDto })
    expertiseScope: ExpertiseScopeDto;

    @ApiProperty({ type: new Array<ActualWorklogsByProjectDto>() })
    @IsArray()
    actualWorkloadsByProject: ActualWorklogsByProjectDto[];
}
