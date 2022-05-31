import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class DataPotentialIssuesDto {
    @ApiProperty()
    week: number;

    @ApiProperty()
    committedWorkload: number;

    @ApiProperty()
    plannedWorkload: number;

    @ApiProperty()
    actualWorkload: number;

    @ApiProperty()
    issueStatus: IssueStatus;

    @ApiProperty()
    @IsString()
    note: string;
}
