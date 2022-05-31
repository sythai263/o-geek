import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class PotentialIssueDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 23 })
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 56 })
    userId: number;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.POTENTIAL_ISSUE })
    @IsEnum(IssueStatus)
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty({ example: 'Potential issue.' })
    @IsString()
    @IsNotEmpty()
    note: string;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsNotEmpty()
    firstDateOfWeek: Date;

    @ApiProperty({ example: new Date() })
    @IsDateString()
    @IsNotEmpty()
    createdAt: Date;
}
