import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, MinDate } from 'class-validator';

import { PlannedWorkloadStatus } from '../../../../common/constants/plannedStatus';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { CommittedWorkloadDto } from './committedWorkload.dto';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class PlannedWorkloadDto {
    @ApiProperty({
        type: () => UniqueEntityID,
        example: new UniqueEntityID(1692),
    })
    id: UniqueEntityID;

    @ApiProperty({ type: () => UserDto })
    user: UserDto;

    @ApiProperty({ type: () => ContributedValueDto })
    contributedValue: ContributedValueDto;

    @ApiProperty({ type: () => CommittedWorkloadDto })
    committedWorkload: CommittedWorkloadDto;

    @ApiProperty({ example: 40 })
    @Min(0)
    plannedWorkload: number;

    @ApiProperty({ example: new Date() })
    @IsNotEmpty()
    @MinDate(new Date())
    startDate: Date;

    @ApiProperty({
        enum: PlannedWorkloadStatus,
        example: PlannedWorkloadStatus.PLANNING,
    })
    status: PlannedWorkloadStatus;

    @ApiProperty({ example: new Date() })
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    updatedAt?: Date;
}
