import { ApiProperty } from '@nestjs/swagger';

import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { ExpertiseScopeShortDto } from '../getContributedValue/expertiseScopeShort.dto';
import { ValueStreamShortDto } from '../overviewSummaryYear/valueStreamShort.dto';
export class UserCompactDto {
    @ApiProperty({
        example: 1,
    })
    id: number;

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

    constructor(id?: number, alias?: string, name?: string, avatar?: string) {
        this.id = id;
        this.alias = alias;
        this.name = name;
        this.avatar = avatar;
    }
}

export class CommittedWorkloadShortDto {
    @ApiProperty({ example: 10 })
    id: number;

    @ApiProperty({ type: UserCompactDto })
    user: UserCompactDto;

    @ApiProperty({ type: ValueStreamShortDto })
    valueStream: ValueStreamShortDto;

    @ApiProperty({ type: ExpertiseScopeShortDto })
    expertiseScope: ExpertiseScopeShortDto;

    @ApiProperty({ example: 40 })
    committedWorkload: number;

    @ApiProperty({ example: new Date('2022-01-01') })
    startDate: Date;

    @ApiProperty({ example: new Date('2022-06-30') })
    expiredDate: Date;

    @ApiProperty({
        enum: CommittedWorkloadStatus,
        example: CommittedWorkloadStatus.ACTIVE,
    })
    status: CommittedWorkloadStatus;

    @ApiProperty({ example: new Date() })
    createdAt: Date;
}
