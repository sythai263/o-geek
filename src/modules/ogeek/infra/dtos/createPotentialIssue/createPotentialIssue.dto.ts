import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class CreatePotentialIssueDto {
    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: new Date() })
    @IsString()
    @IsNotEmpty()
    firstDateOfWeek: Date;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.POTENTIAL_ISSUE })
    @IsString()
    @IsNotEmpty()
    status: IssueStatus;

    @ApiProperty({
        example:
            'Nam is overloading in Project Aqua 2.0 due to its several technical issues.',
    })
    @IsString()
    @IsOptional()
    note?: string;
}
