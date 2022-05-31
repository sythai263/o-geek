import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

import { IssueStatus } from '../../../../../common/constants/issueStatus';

export class UpdatePotentialIssueDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ enum: IssueStatus, example: IssueStatus.RESOLVED })
    @IsEnum(IssueStatus)
    @IsOptional()
    status?: IssueStatus;

    @ApiProperty({
        example: 'Resolve potential issue.',
    })
    @IsString()
    note: string;
}
