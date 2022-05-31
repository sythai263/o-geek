import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { CommittingWorkloadStatus } from '../../../../../../common/constants/committingStatus';
import { UserCompactDto } from '../../getCommittedWorkload/getCommittedWorkloadShort.dto';
export class CommittingWorkload {
    @ApiProperty({ type: UserCompactDto })
    user: UserCompactDto;

    @ApiProperty({
        type: Number,
        description: 'Summary committed workload',
    })
    totalCommit: number;

    @ApiProperty({
        enum: CommittingWorkloadStatus,
        example: CommittingWorkloadStatus.UNHANDLED,
    })
    @IsNotEmpty({ message: 'ERROR_EMPTY_STATUS_FIELD' })
    status: CommittingWorkloadStatus;

    @ApiProperty({ example: 50 })
    @IsNumber()
    @IsNotEmpty({ message: 'ERROR_EMPTY_DAYS_OF_EXPIRES_FIELD' })
    daysUntilExpire: number;

    @ApiProperty({ example: new Date() })
    @IsString()
    @IsNotEmpty({ message: 'ERROR_EMPTY_START_DATE_FIELD' })
    startDate: Date;

    @ApiProperty({ example: new Date() })
    @IsString()
    @IsNotEmpty({ message: 'ERROR_EMPTY_EXPIRED_DATE_FIELD' })
    expiredDate: Date;
}
export class DataListCommittingWorkload {
    @ApiProperty({
        type: CommittingWorkload,
    })
    data: CommittingWorkload[];

    constructor(data: CommittingWorkload[]) {
        this.data = data;
    }
}

export class FilterListCommittingWorkload {
    @ApiPropertyOptional({
        description: 'Search data by alias',
    })
    @Type(() => String)
    @IsOptional()
    search?: string;
}
