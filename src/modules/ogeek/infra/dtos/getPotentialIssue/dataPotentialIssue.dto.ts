import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class DataPotentialIssueDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 56 })
    userId: number;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.POTENTIAL_ISSUE })
    @IsEnum(IssueStatus)
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    note: string;

    @IsDate()
    @ApiProperty()
    @IsNotEmpty()
    firstDateOfWeek: Date;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty()
    @IsString()
    picName: string;
}
