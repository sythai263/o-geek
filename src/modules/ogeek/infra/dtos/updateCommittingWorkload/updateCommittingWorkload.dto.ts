import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

import { CommittedWorkloadStatus } from '../../../../../common/constants/committedStatus';
import { ExpertiseScopeShortDto } from '../getContributedValue/expertiseScopeShort.dto';
import { ValueStreamShortDto } from '../overviewSummaryYear/valueStreamShort.dto';

export class UserCompactDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'thai.ls' })
    @IsString()
    alias: string;

    @ApiProperty({ example: 'Sỹ Thái' })
    @IsString()
    name: string;

    constructor(id?: number, alias?: string, name?: string) {
        this.id = id;
        this.alias = alias;
        this.name = name;
    }
}

export class CommittingWorkloadDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ type: UserCompactDto })
    user: UserCompactDto;

    @ApiProperty({ type: ValueStreamShortDto })
    valueStream: ValueStreamShortDto;

    @ApiProperty({ type: ExpertiseScopeShortDto })
    expertiseScope: ExpertiseScopeShortDto;

    @ApiProperty({
        enum: CommittedWorkloadStatus,
        example: CommittedWorkloadStatus.NOT_RENEW,
    })
    status: CommittedWorkloadStatus;

    @ApiProperty({ example: 40 })
    @IsNumber()
    committedWorkload: number;

    @ApiProperty({ example: new Date('2022-01-01') })
    @IsDate()
    startDate: Date;

    @ApiProperty({ example: new Date('2022-06-30') })
    @IsDate()
    expiredDate: Date;

    constructor(
        id?: number,
        user?: UserCompactDto,
        valueStream?: ValueStreamShortDto,
        expertiseScope?: ExpertiseScopeShortDto,
        status?: CommittedWorkloadStatus,
        committedWorkload?: number,
        startDate?: Date,
        expiredDate?: Date,
    ) {
        this.id = id;
        this.user = user;
        this.valueStream = valueStream;
        this.expertiseScope = expertiseScope;
        this.status = status;
        this.committedWorkload = committedWorkload;
        this.startDate = startDate;
        this.expiredDate = expiredDate;
    }
}

export class DataCommittingWorkload {
    @ApiProperty({
        type: CommittingWorkloadDto,
        isArray: true,
    })
    data: CommittingWorkloadDto[];
    constructor(data: CommittingWorkloadDto[]) {
        this.data = data;
    }
}
