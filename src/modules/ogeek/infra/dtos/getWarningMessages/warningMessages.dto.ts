import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { PlannedWorkloadStatus } from '../../../../../common/constants/plannedStatus';

export class WarningMessagesDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: PlannedWorkloadStatus.EXECUTING })
    weekStatus: PlannedWorkloadStatus;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: true })
    hasPlannedWorkload: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: true })
    hasReviewedRetro: boolean;

    constructor(
        weekStatus: PlannedWorkloadStatus,
        hasPlannedWorkload: boolean,
        hasReviewedRetro: boolean,
    ) {
        this.weekStatus = weekStatus;
        this.hasPlannedWorkload = hasPlannedWorkload;
        this.hasReviewedRetro = hasReviewedRetro;
    }
}
