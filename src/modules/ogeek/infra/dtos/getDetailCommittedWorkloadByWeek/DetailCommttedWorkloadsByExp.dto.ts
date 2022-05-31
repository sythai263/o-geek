import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

import { ExpertiseScopeDto } from '../expertiseScope.dto';
import { ActualWorklogsByProjectAndWeekDto } from './ActualWorkloadsByProject.dto';

export class DetailCommittedWorkloadsByExpAndWeekDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    committedWorkloadId: number;

    @ApiProperty({ example: 20 })
    @IsInt()
    committedWorkload: number;

    @ApiProperty({ type: ExpertiseScopeDto })
    expertiseScope: ExpertiseScopeDto;

    @ApiProperty({ type: new Array<ActualWorklogsByProjectAndWeekDto>() })
    @IsArray()
    actualWorkloadsByProject: ActualWorklogsByProjectAndWeekDto[];
}
