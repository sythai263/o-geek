import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class PotentialIssueResponseDto {
    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ example: new Date() })
    @IsString()
    @IsNotEmpty()
    firstDateOfWeek: Date;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.POTENTIAL_ISSUE })
    @IsDateString()
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty({
        example:
            'Nam is overloading in Project Aqua 2.0 due to its several technical issues.',
    })
    @IsString()
    @IsNotEmpty()
    note: string;
}
