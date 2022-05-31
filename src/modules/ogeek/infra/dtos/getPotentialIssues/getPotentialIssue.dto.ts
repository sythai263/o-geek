import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class PotentialIssuesDto {
    @ApiProperty({ enum: IssueStatus, example: IssueStatus.POTENTIAL_ISSUE })
    @IsEnum(IssueStatus)
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty({ example: 'Potential issue.' })
    @IsString()
    @IsNotEmpty()
    note: string;
}
