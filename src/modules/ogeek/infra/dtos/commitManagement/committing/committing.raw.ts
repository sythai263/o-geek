import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { CommittedWorkloadStatus } from '../../../../../../common/constants/committedStatus';

export class CommittingWorkloadRaw {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ID_FIELD' })
    @IsNumber()
    userId: number;

    @ApiProperty({ example: 'quang.hm' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_ALIAS_FIELD' })
    @IsString()
    alias: string;

    @ApiProperty({ example: 'Minh Quang' })
    @IsNotEmpty({ message: 'ERROR_EMPTY_NAME_FIELD' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'https://www.linkpicture.com/q/user_6.png' })
    @IsString()
    avatar: string;

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

    @ApiProperty({ example: 50 })
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

export class DataListCommittingWorkloadRaw {
    @ApiProperty({
        type: CommittingWorkloadRaw,
    })
    data: CommittingWorkloadRaw[];

    constructor(data: CommittingWorkloadRaw[]) {
        this.data = data;
    }
}
