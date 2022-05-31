import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinDate } from 'class-validator';

import { CommittedWorkloadStatus } from '../../../../common/constants/committedStatus';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { ContributedValueDto } from './contributedValue.dto';
import { UserDto } from './user.dto';

export class CommittedWorkloadDto {
    @ApiProperty({ type: UniqueEntityID, example: 134 })
    id: UniqueEntityID | number;

    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ type: ContributedValueDto })
    contributedValue?: ContributedValueDto;

    @ApiProperty({ example: 40 })
    committedWorkload: number;

    @ApiProperty({ example: new Date() })
    @MinDate(new Date())
    startDate: Date;

    @ApiProperty({ example: new Date() })
    @MinDate(new Date())
    expiredDate: Date;

    @ApiProperty({
        enum: CommittedWorkloadStatus,
        example: CommittedWorkloadStatus.ACTIVE,
    })
    status: CommittedWorkloadStatus;

    @ApiProperty()
    createdBy?: number;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    updatedAt?: Date;

    @ApiProperty({ example: new Date() })
    @IsOptional()
    deletedAt?: Date;
}
