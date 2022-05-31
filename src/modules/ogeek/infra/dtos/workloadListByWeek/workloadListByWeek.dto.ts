import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';
import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';
import { CommittedWorkloadByWeekDto } from './committedWorkloadOfWeek.dto';
import { ExpertiseScopeWithinWorkloadListDto } from './expertiseScopeWithinWorkloadList.dto';
import { UserWorkloadDto } from './userWorkload.dto';

export class WorkloadListByWeekDto {
    @ApiProperty({ type: UserWorkloadDto })
    @IsNotEmpty()
    user: UserWorkloadDto;

    @ApiProperty({
        type: ExpertiseScopeWithinWorkloadListDto,
        isArray: true,
        default: [],
    })
    @IsArray()
    @IsNotEmpty()
    expertiseScopes: ExpertiseScopeWithinWorkloadListDto[];

    @ApiProperty({ type: CommittedWorkloadByWeekDto })
    @IsNotEmpty()
    committedWorkload: CommittedWorkloadByWeekDto;

    @ApiProperty({ example: 20, default: 0 })
    @IsNumber()
    @IsNotEmpty()
    plannedWorkload: number;

    @ApiProperty({ example: 18, default: 0 })
    @IsNumber()
    @IsNotEmpty()
    actualWorkload: number;

    @ApiProperty({
        enum: PlannedWorkloadStatus,
        example: PlannedWorkloadStatus.PLANNING,
    })
    @IsString()
    @IsEnum(PlannedWorkloadStatus)
    @IsNotEmpty()
    weekStatus: PlannedWorkloadStatus;

    @ApiProperty({
        enum: IssueStatus,
        example: null,
        default: null,
    })
    @IsString()
    @IsNotEmpty()
    issueStatus: IssueStatus;
}
