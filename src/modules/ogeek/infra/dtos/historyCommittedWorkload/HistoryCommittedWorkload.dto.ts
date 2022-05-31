import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';

export class UserCommittedWorkload {
    @ApiProperty({
        example: 1,
    })
    userId: number;

    @ApiProperty({
        example: 'thai.ls',
    })
    alias: string;

    @ApiProperty({
        example: 'Sỹ Thái',
    })
    name: string;

    @ApiProperty({
        example: 'https://www.linkpicture.com/q/user_6.png',
    })
    avatar?: string;

    @ApiProperty({
        type: Number,
        description: 'Summary committed workload',
    })
    totalCommit: number;

    @ApiProperty({
        enum: CommittedWorkloadStatus,
        example: CommittedWorkloadStatus.ACTIVE,
    })
    status: CommittedWorkloadStatus;

    @ApiProperty({ example: new Date() })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    expiredDate: Date;
}

export class DataHistoryCommittedWorkload {
    @ApiProperty({
        type: UserCommittedWorkload,
        isArray: true,
    })
    data: UserCommittedWorkload[];

    constructor(data: UserCommittedWorkload[]) {
        this.data = data;
    }
}
export class FilterHistoryCommittedWorkload {
    @ApiPropertyOptional({
        description: 'Filter by User ID',
    })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    userId?: number;

    @ApiPropertyOptional({
        description: 'Search data by alias',
    })
    @Type(() => String)
    @IsOptional()
    search?: string;
}
