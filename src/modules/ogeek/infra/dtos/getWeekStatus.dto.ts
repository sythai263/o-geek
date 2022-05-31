import { ApiProperty } from '@nestjs/swagger';

import { PlannedWorkloadStatus } from '../../../../common/constants/plannedStatus';
import { PlannedWorkloadEntity } from '../database/entities';
// import { UserEntity } from '../database/entities/user.entity';

export class GetWeekStatusDto {
    @ApiProperty({
        enum: PlannedWorkloadStatus,
        example: PlannedWorkloadStatus.PLANNING,
    })
    weekStatus?: PlannedWorkloadStatus;

    constructor(plannedWorkload?: PlannedWorkloadEntity) {
        // this.weekStatus = user.weekStatus;
        this.weekStatus = plannedWorkload.status;
    }
}
